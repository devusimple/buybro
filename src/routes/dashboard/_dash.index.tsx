import db from '@/lib/db'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import ProductCard from '../-components/product-card';
import type { Product } from '@/types';
export const Route = createFileRoute('/dashboard/_dash/')({
  component: RouteComponent,
})



function RouteComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([])


  async function fetchProduct() {
    try {
      const { data, error, isLoading } = db.useQuery({ products: { $: {} } });
      setLoading(isLoading);
      setError(error?.message);
      setProducts(data?.products!)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [])
  if (loading) return (
    <div className="w-full h-full flex justify-center items-center">
      <Loader2 className='animate-spin' />
    </div>
  )
  if (error) return (
    <div className="w-full h-full flex justify-center items-center">
      <p>{error}</p>
    </div>
  )
  return (
    <div className="w-full h-full max-h-screen">
      {
        products.map((product) => (
          <ProductCard data={product} />
        ))
      }
    </div>
  )
}
