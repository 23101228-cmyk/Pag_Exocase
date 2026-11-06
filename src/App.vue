<script setup lang="ts">
import { provide } from 'vue'
import { appStateKey, createAppState } from './composables/appState'
import HomePage from './pages/HomePage.vue'
import StorePage from './pages/StorePage.vue'
import AboutPage from './pages/AboutPage.vue'
import PortfolioPage from './pages/PortfolioPage.vue'
import BlogPage from './pages/BlogPage.vue'

const state = createAppState()
provide(appStateKey, state)
const { waLink, blogCategories, cartOpen, cart, activeNav, currentPage, blogCategory, newsletterStatus, selectedPetImage, cartCount, cartTotal, go, fmt, pic, qty, checkout } = state
</script>

<template>
<div class="site-shell">
  <header class="topbar">
    <div class="topline"><span>☎ +51 916 588 600</span><span>✉ exocasewonders@gmail.com</span><span>⌖ Lima, Perú</span><span class="social">◎　f　♪</span></div>
    <nav class="nav-wrap">
      <button class="brand" @click="go('inicio')"><span class="brand-mark">3D</span><span><b>EXOCASE3D</b><small>IMPRESIÓN 3D PROFESIONAL</small></span></button>
      <div class="nav-links"><button :class="{selected:activeNav==='inicio'}" @click="go('inicio')">Inicio</button><button :class="{selected:activeNav==='servicios'}" @click="go('servicios')">Servicios</button><button :class="{selected:activeNav==='portafolio'}" @click="go('portafolio')">Portafolio</button><button :class="{selected:activeNav==='tienda'}" @click="go('tienda')">Tienda</button><button :class="{selected:activeNav==='cotizador'}" @click="go('cotizador')">Cotizador STL</button><button :class="{selected:activeNav==='blog'}" @click="go('blog')">Blog</button><button :class="{selected:activeNav==='nosotros'}" @click="go('nosotros')">Nosotros</button><button :class="{selected:activeNav==='contacto'}" @click="go('contacto')">Contacto</button></div>
      <div class="nav-actions"><button class="cart-button" @click="cartOpen=true" aria-label="Abrir carrito">🛒<span>{{cartCount}}</span></button><a class="button button-primary nav-quote" :href="waLink" target="_blank" rel="noreferrer">☏ COTIZAR POR WHATSAPP</a></div>
    </nav>
  </header>

  <main>
    <HomePage />
    <StorePage />
    <AboutPage />
    <PortfolioPage />
    <BlogPage />
  </main>
  <footer v-if="currentPage === 'blog'" class="footer site-footer blog-footer"><div class="blog-footer-grid"><div class="footer-about"><button class="brand" @click="go('inicio')"><span class="brand-mark">3D</span><span><b>EXOCASE3D</b><small>IDEAS EN 3D</small></span></button><p>Transformamos ideas en productos reales con impresión 3D de precisión y calidad.</p></div><div class="footer-links"><b>ENLACES</b><button @click="go('inicio')">Inicio</button><button @click="go('servicios')">Servicios</button><button @click="go('portafolio')">Portafolio</button><button @click="go('tienda')">Tienda</button><button @click="go('blog')">Blog</button><button @click="go('nosotros')">Nosotros</button><button @click="go('contacto')">Contacto</button></div><div class="footer-links"><b>CATEGORÍAS DEL BLOG</b><button v-for="item in blogCategories.slice(1)" :key="item" @click="blogCategory=item;go('blog')">{{item}}</button></div><div class="footer-links"><b>RECURSOS</b><button @click="newsletterStatus='Las guías descargables estarán disponibles próximamente.'">Guías descargables</button><button @click="newsletterStatus='Las plantillas 3D estarán disponibles próximamente.'">Plantillas 3D</button><button @click="go('contacto')">Preguntas frecuentes</button><button @click="go('contacto')">Términos y condiciones</button><button @click="go('contacto')">Política de privacidad</button></div><div class="footer-contact"><b>CONTACTO</b><span>📍　Lima, Perú</span><span>✉　exocasewonders@gmail.com</span><span>☎　+51 916 588 600</span><a :href="waLink" target="_blank" rel="noreferrer">☏　Escríbenos por WhatsApp</a></div></div><div class="footer-bottom">© 2026 EXOCASE3D. Todos los derechos reservados. <span>VISA　 Mastercard　 Yape　 Plin</span></div></footer>
  <footer v-else class="footer site-footer"><div class="footer-main"><div class="footer-about"><button class="brand" @click="go('inicio')"><span class="brand-mark">3D</span><span><b>EXOCASE3D</b><small>TIENDA & SERVICIOS</small></span></button><p>Convertimos tus diseños e ideas en modelos físicos de alta fidelidad. Maquetas, llaveros personalizados y proyectos mecatrónicos en todo el Perú.</p></div><div class="footer-links"><b>ENLACES RÁPIDOS</b><button @click="go('inicio')">Inicio</button><button @click="go('tienda')">Catálogo</button><button @click="go('trabajos')">Proyectos destacados</button><button @click="go('nosotros')">Sobre Nosotros</button><button @click="go('contacto')">Contacto</button></div><div class="footer-contact"><b>CONTACTO</b><span>⌖　Jirón Cineraria 109, Santiago de Surco 15023</span><span>☎　Consultas: +51 916 588 600</span><span>✉　exocasewonders@gmail.com</span><div class="footer-social"><span>◎</span><span>f</span><span>♪</span></div></div></div><div class="footer-bottom">© 2026 EXOCASE3D · IMPRESIÓN 3D PROFESIONAL <span>Lima, Perú · Envíos a todo el país</span></div></footer>

  <div v-if="selectedPetImage" class="pet-lightbox-backdrop" @click.self="selectedPetImage=null" @keydown.esc="selectedPetImage=null"><section class="pet-lightbox" role="dialog" aria-modal="true" :aria-label="selectedPetImage.name"><button class="pet-lightbox-close" @click="selectedPetImage=null" aria-label="Cerrar imagen ampliada">×</button><img :src="pic(selectedPetImage)" :alt="selectedPetImage.name"><p>{{selectedPetImage.name}}</p></section></div>
  <div v-if="cartOpen" class="drawer-backdrop" @click.self="cartOpen=false"><aside class="cart-drawer"><div class="drawer-heading"><div><small>EXOCASE3D</small><h2>Tu carrito <span>({{cartCount}})</span></h2></div><button class="close-button" @click="cartOpen=false">×</button></div><div v-if="!cart.length" class="cart-empty"><span>🛒</span><b>Tu carrito está vacío</b><p>Explora los productos y agrega tus favoritos.</p><button class="button button-outline" @click="cartOpen=false;go('tienda')">Ir a la tienda</button></div><div v-else class="cart-items"><article v-for="item in cart" :key="item.id" class="cart-item"><div class="cart-thumb"><img v-if="item.image" :src="item.image" :alt="item.name"><span v-else>⬡</span></div><div class="cart-item-text"><b>{{item.name}}</b><small>S/ {{fmt(item.price,2)}} c/u</small><div class="qty-control"><button @click="qty(item.id,-1)">−</button><span>{{item.qty}}</span><button @click="qty(item.id,1)">+</button></div></div><strong>S/ {{fmt(item.price*item.qty,2)}}</strong></article></div><div v-if="cart.length" class="cart-bottom"><div><span>Subtotal referencial</span><b>S/ {{fmt(cartTotal,2)}}</b></div><button class="button button-primary" @click="checkout">Continuar por WhatsApp <span>→</span></button><small>Confirmaremos disponibilidad, precio final y envío.</small></div></aside></div>
</div>
</template>
