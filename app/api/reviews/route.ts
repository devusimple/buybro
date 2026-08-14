import { NextResponse } from "next/server"
import { id } from "@instantdb/admin"

import { adminDb } from "@/lib/adminDb"

export const runtime = "nodejs"

type ReviewBody = {
  refreshToken?: unknown
  productId?: unknown
  rating?: unknown
  comment?: unknown
  authorName?: unknown
  authorEmail?: unknown
  mediaIds?: unknown
}

function fail(error: string, status = 200) {
  return NextResponse.json({ ok: false, error }, { status })
}

export async function POST(request: Request) {
  let body: ReviewBody
  try {
    body = await request.json()
  } catch {
    return fail("product.reviewError")
  }

  const {
    refreshToken,
    productId,
    rating,
    comment,
    authorName,
    authorEmail,
    mediaIds,
  } = body

  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    return fail("product.reviewError", 401)
  }
  if (typeof productId !== "string" || productId.length === 0) {
    return fail("product.reviewError")
  }
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return fail("product.reviewError")
  }
  if (typeof authorName !== "string" || authorName.trim().length === 0) {
    return fail("product.reviewError")
  }
  if (
    mediaIds != null &&
    (!Array.isArray(mediaIds) ||
      mediaIds.some((mediaId) => typeof mediaId !== "string"))
  ) {
    return fail("product.reviewError")
  }

  let user
  try {
    user = await adminDb.auth.verifyToken(refreshToken)
  } catch {
    return fail("product.reviewError", 401)
  }
  if (!user || typeof user.id !== "string") {
    return fail("product.reviewError", 401)
  }

  const { products } = await adminDb.query({
    products: {
      $: { where: { id: productId } },
    },
  })
  const product = products[0]
  if (!product) {
    return fail("product.notFound")
  }

  const { orders } = await adminDb.query({
    orders: {
      $: { where: { ownerId: user.id } },
      items: { product: {} },
    },
  })
  const hasPurchased = orders.some((order) =>
    (order.items ?? []).some((item) => item.product?.id === productId)
  )

  const reviewId = id()
  const currentCount = product.reviewCount ?? 0
  const nextCount = currentCount + 1
  const nextRating =
    Math.round(
      (((product.rating ?? 0) * currentCount + rating) / nextCount) * 10
    ) / 10

  const chunk = adminDb.tx.reviews[reviewId]
    .create({
      authorName: authorName.trim(),
      authorEmail:
        typeof authorEmail === "string" && authorEmail.trim().length > 0
          ? authorEmail.trim()
          : undefined,
      rating,
      comment:
        typeof comment === "string" && comment.trim().length > 0
          ? comment.trim()
          : undefined,
      verified: hasPurchased || undefined,
      createdAt: Date.now(),
    })
    .link({ product: productId, author: user.id })

  const link = Array.isArray(mediaIds) && mediaIds.length > 0
  if (link) {
    chunk.link({ media: mediaIds as string[] })
  }

  try {
    await adminDb.transact([
      chunk,
      adminDb.tx.products[productId].update({
        rating: nextRating,
        reviewCount: nextCount,
      }),
    ])
  } catch {
    return fail("product.reviewError")
  }

  return NextResponse.json({ ok: true, id: reviewId })
}
