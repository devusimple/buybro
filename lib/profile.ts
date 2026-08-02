import { id, type InstaQLEntity } from "@instantdb/react"

import { clientDb } from "@/lib/clientDb"
import type { AppSchema } from "@/instant.schema"

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Profile = InstaQLEntity<AppSchema, "profiles", { avatar: {} }>
export type Address = InstaQLEntity<AppSchema, "addresses">
export type Order = InstaQLEntity<
  AppSchema,
  "orders",
  { items: { product: {} } }
>
/* eslint-enable @typescript-eslint/no-empty-object-type */

export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const

export const BANGLADESH_DISTRICTS = [
  "Dhaka",
  "Gazipur",
  "Narayanganj",
  "Tangail",
  "Narsingdi",
  "Manikganj",
  "Munshiganj",
  "Kishoreganj",
  "Chattogram",
  "Cox's Bazar",
  "Cumilla",
  "Noakhali",
  "Feni",
  "Brahmanbaria",
  "Chandpur",
  "Lakshmipur",
  "Khagrachari",
  "Rangamati",
  "Bandarban",
  "Rajshahi",
  "Bogura",
  "Pabna",
  "Natore",
  "Chapai Nawabganj",
  "Sirajganj",
  "Joypurhat",
  "Naogaon",
  "Khulna",
  "Jessore",
  "Bagerhat",
  "Satkhira",
  "Jhenaidah",
  "Kushtia",
  "Magura",
  "Chuadanga",
  "Meherpur",
  "Narail",
  "Barishal",
  "Bhola",
  "Patuakhali",
  "Pirojpur",
  "Jhalokati",
  "Barguna",
  "Sylhet",
  "Moulvibazar",
  "Habiganj",
  "Sunamganj",
  "Rangpur",
  "Dinajpur",
  "Kurigram",
  "Gaibandha",
  "Nilphamari",
  "Panchagarh",
  "Thakurgaon",
  "Lalmonirhat",
  "Mymensingh",
  "Jamalpur",
  "Netrokona",
  "Sherpur",
] as const

export async function ensureProfile(userId: string, profile?: Profile) {
  if (profile) {
    return profile.id
  }
  const profileId = id()
  await clientDb.transact(
    clientDb.tx.profiles[profileId].create({
      ownerId: userId,
      createdAt: Date.now(),
    })
  )
  return profileId
}
