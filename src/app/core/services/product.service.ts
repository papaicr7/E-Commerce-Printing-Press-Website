import { Injectable, signal } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly products = signal<Product[]>([
    { id: '1', name: 'Classic White Mug', category: 'Drinkware', price: 14.99, description: 'A timeless ceramic mug perfect for your morning coffee or tea. Features a smooth glossy finish and a comfortable handle. Fully customizable with your own designs, logos, or text. Microwave and dishwasher safe for everyday convenience.', shortDescription: 'Ceramic 11oz, dishwasher safe', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKYmkMH-G5pARflD56aNoYiX-zj48VQL5IUMvdLodGQX8OM4kMz-6ct0fLf3wiCcRwp94e5i8tbji5gewHrH7xt0x1g845AyVvKWMiJN-Z8Eec_-QNtKvYtY1gePvRq2Ynwf4BHApyWvZkcKFyWzjyba2nyV6tMlSdD4kL5HMu8NAvuV5MmX2tr1N2XXJrv4EQ_uGf17iKAzG5YrefGCS4FHZGaNuNnsCI2Yln-7g9OHOTqpaqCM1i6wAZ5vj994xhKfjfp5tWalS3', tags: ['bestseller'], inStock: true, rating: 4.8 },
    { id: '2', name: 'Premium Cotton Tee', category: 'Apparel', price: 29.99, description: 'Made from 100% organic cotton, this premium t-shirt offers unmatched comfort and durability. Available in multiple sizes with a relaxed unisex fit. The print area supports high-resolution custom designs that won\'t fade after washing.', shortDescription: '100% organic cotton, unisex fit', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmqSbD60djyTf66CkAbhr0UuCeTERgIZYITZULE-j6bjeyMkZsl4MsjAdXx_f8FkSn7AMJ6T4YXTpqGHOK_l6ufAJ_Jk-1oBBaTaw2OXTHD2PNSCI0OQ2MbY-FwJRlmOP9J8j87nwr6vudKS2-Le4eGv88ssPKBEv7QYH_bN_Tqt4sBx8DIJchkU2zv0DF9nPeoJty7DUllHRM5pdhC1yrNwZX81-flYmH0VqKviEohr1ug-Xu16BvRRc4BiPornuKLlzp7TPvY_6d', tags: ['new'], inStock: true, rating: 4.5 },
    { id: '3', name: 'Insulated Eco Bottle', category: 'Drinkware', price: 24.99, description: 'Stainless steel double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12. Eco-friendly and BPA-free with a leak-proof lid. Customize the exterior with vibrant full-wrap prints.', shortDescription: 'Stainless steel, keeps cold 24h', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNgejeZFVZrxF4GTHQabsrmFplJU8XW4YjbVcwfoDl_q2WsaLOGYtykoc7aqARp6shnJ1kgD1C-N09GpwNKKh1DK3B9Hr_KdJ2_KhLrSGdcYdnvprA0xdnkbEo1Z58ac9BMqKKjwH5sDQJY0ASK3gAWFh8no17vAfOPQh4O6wM8Tu2U2LTuQshu_wvIMiax__jZRjnW0jiUw7hOuduHDmblPexlVO7QejLLOMmFEFdWpt0qxWRU27vjSYPq46G2VMBGzJhrzNLjQth', tags: ['eco'], inStock: true, rating: 4.9 },
    { id: '4', name: 'Photo Memory Frame', category: 'Frames', price: 19.99, description: 'Beautiful walnut wood frame sized 8x10 inches, perfect for preserving your cherished memories. Features a velvet backing and elegant glass front. Comes with both wall-mount and easel-back stand options.', shortDescription: 'Walnut wood, 8x10 inches', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVSa6MGlk0xNGCBQ4gnxaVhT0Cb62NsQg7JwDyN-C1qoXs9plksn2NZ7zoIdzF0npxrRtP3PbisAjnTLCt_X58_Grd6gmHy0FsJ5bmg99azyrD-QVsl7T5EFOQ_6H2tqZgvm2VbcruyHpPyvQtiAfDVmz1mMLUY-EgPgTl0xulPrQuGJa02aBfJ8x28HfL_3rb4DscZKr6j3wLwPAGQywNdJbKyOQ91rZSs0GRPQ9_5ybbj3YmEH3tvZ9bNgJhNpoI_zM7xJUvXQqa', tags: [], inStock: true, rating: 4.6 },
    { id: '5', name: 'Magic Color Mug', category: 'Drinkware', price: 18.99, description: 'A magical heat-sensitive mug that reveals your custom design when filled with hot liquid. Perfect for gifts or personal use. The surprise effect never gets old and the print stays vibrant wash after wash.', shortDescription: 'Reveals design when hot', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtnwabms4fUga4xYpOprI0Unb14n9UT2D_RBaT5l0a4QqsY5jPEmSCnlFTIMLavNwvoFxJWfQyy8ZVJ6icnnT30OB6y9JBFV3eKl4pYw-mq2fnz97N6JpEuIb1d7Lkm8GXhZgRQlCL2c1ASPHJ-4hfiUPpAMEPNz_Qo6SwwmIOBLLTKi2MVfDha1_2p2MkHwTERxFIglSaNibp4GLH1WoPlY6w7NeOqFE3WCQCeh3QdxM-iqsap8Vqe9I_z4b19XmNFPkN3z91Y_y9', tags: ['bestseller'], inStock: true, rating: 4.7 },
    { id: '6', name: 'Canvas Tote Bag', category: 'Bags', price: 16.99, description: 'Heavy-duty canvas tote bag with a secure zip closure. Spacious interior with an inner pocket for small items. Features reinforced handles for daily use. The full print area makes it a walking billboard for your brand or art.', shortDescription: 'Heavy-duty canvas, zip closure', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzhX9tb44k8ZJycVBbVh5xDatUJJ6ZNEHX2z8m_1vnNd4JI0MYfPcdPr7k9J_Vl8sNsvHgkUgVZHxOjnypLI7VwjtAp0x8oAhkLeha-oG5JPy8JTiiBnXzo63JGsAai0y9_qLh9A03vVynkQVuRiaOR7UwlQ-wUksRQUjOZ66j_g0WLPI9By6J2KnuBkmC8WZDEsb_oa5X2ioos7_j8YoHVy6oqnMD5A4sKeAxkQqdj_G0HfjzIER19C5lOEwDuSyGB9TFwKhUCWZJ', tags: [], inStock: true, rating: 4.3 },
    { id: '7', name: 'Hoodie Premium', category: 'Apparel', price: 49.99, description: 'Premium fleece-lined hoodie with a soft-touch exterior. Features a spacious kangaroo pocket and adjustable drawstring hood. Available in custom colors with large front and back print areas for maximum design impact.', shortDescription: 'Fleece lined, custom print areas', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACYDxvu9dW008OYnY1aT4kmQpQFIi1-Rdz2kvTEAr6ExpaAR-yjN-QW4vxCUToD0tyndhNfyC-SyuTfXRWlC0h7QTSmkhTYq3Bvx-TyVm_q-POiZh0mgIaBC5FvQhaP6HlDN51jNVEs_mWeOk9eX-pZj8NaB0C9-JQbP3cCMwchFNmhQvyTpBzCg8C08gOO2q4EPm_ujs9taK5YOtbHKSt2wZF5UhinxbWqlwRlDTkpI367KpGfoeopIF_IrfTtrkvvBFWcAqeHbFA', tags: ['new'], inStock: true, rating: 4.4 },
    { id: '8', name: 'Leather Notebook', category: 'Stationery', price: 22.99, description: 'Genuine leather-bound notebook with 200 pages of premium ivory paper. Features a ribbon bookmark and elastic closure band. The cover can be custom embossed with your name, logo, or design. Makes an exceptional gift.', shortDescription: 'Genuine leather, 200 pages', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNnKOxsfkP6R0Sc4mfCNVpyhT-aek2pgQS1UVB7eTmz1t6Cb_ZeEP8Iu7d6FObJ_BU2tygPuYlOSx_hLMD9XV7UduuZB0JsGNQN5zO0WcPPPzVL5hueG6SpWAB0Ldm8buy2OIM1bUSUaptbtr9QRdwJYLMCil19dOWCRdhlvRgZGGgRWBHyzrYGJvVt4I_S8rdpQrEw6aXuetIptKN3a-W_vWl-cIsfY3cBbL2qW0MdGWQrgu_ETwkfUg562zPcKhqgZqLIPm_q_de', tags: [], inStock: true, rating: 4.8 },
  ]);

  getById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getByCategory(category: string): Product[] {
    return this.products().filter(p => p.category === category);
  }

  getRelated(productId: string, limit = 4): Product[] {
    const product = this.getById(productId);
    if (!product) return [];
    return this.products()
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  }

  searchProducts(query: string): Product[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.products().filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
}
