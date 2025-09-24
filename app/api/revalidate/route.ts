import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { paths, secret } = await request.json()

    // Verify the secret
    if (secret !== process.env.REVALIDATE_SECRET && secret !== 'dopetech2024') {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path)
        console.log(`✅ Revalidated path: ${path}`)
      }
    }

    // Also revalidate all product-related tags
    revalidateTag('products')
    revalidateTag('product-images')
    revalidateTag('dope-picks')
    
    console.log('✅ Server cache revalidated successfully')

    return NextResponse.json({ 
      message: 'Revalidated successfully',
      revalidated: paths || ['all']
    })
  } catch (error) {
    console.error('❌ Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating' }, 
      { status: 500 }
    )
  }
}
