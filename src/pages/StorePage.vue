<script setup lang="ts">
import { useAppState } from '../composables/appState'
const { categories, category, search, currentPage, filteredProducts, selectedPetImage, fmt, pic, add } = useAppState()
</script>

<template>
<div v-show="currentPage === 'tienda'" class="store-page">
      <header class="store-page-hero"><div><span class="eyebrow"><i></i> CATÁLOGO EXOCASE3D</span><h1>Productos para<br><em>elegir y llevar.</em></h1><p>Encuentra diseños disponibles y agrega tus favoritos al carrito. Los proyectos hechos a medida están en nuestro portafolio.</p></div><div class="store-hero-mark"><span>EXO</span><b>CASE3D</b><small>DISEÑOS · DETALLES · REGALOS</small></div></header>
          <section id="tienda" class="store-section section-anchor"><div class="store-toolbar"><div><span class="eyebrow"><i></i> TIENDA EXOCASE3D</span><h2>ENCUENTRA TU <em>DISEÑO.</em></h2></div><label class="search-box"><span>⌕</span><input v-model="search" placeholder="Buscar productos..."></label></div><div class="store-categories"><button v-for="c in categories" :key="c" :class="{active:category===c}" @click="category=c">{{c}}</button></div>
      <div class="product-grid"><article v-for="p in filteredProducts" :key="p.id" class="product-card"><div class="product-image" :class="p.tone"><img v-if="pic(p)" :src="pic(p)" :alt="p.name" :class="{'zoomable-product-image':p.category==='EXOPET'}" :tabindex="p.category==='EXOPET' ? 0 : undefined" @click="p.category==='EXOPET' && pic(p) ? (selectedPetImage=p) : null" @keydown.enter="p.category==='EXOPET' && pic(p) ? (selectedPetImage=p) : null"><div v-else class="product-art"><span>{{p.glyph}}</span><small>EXOCASE3D</small></div><span class="product-category">{{p.category}}</span><button class="quick-add" @click="add(p)" :aria-label="'Agregar '+p.name">＋</button></div><div class="product-info"><div><small>{{p.category}}</small><h3>{{p.name}}</h3><p>{{p.description}}</p></div><b>S/ {{fmt(p.price,2)}}</b></div><button class="product-add" @click="add(p)">Agregar al carrito <span>→</span></button></article><div v-if="!filteredProducts.length" class="empty-results">No encontramos productos para esa búsqueda.</div></div>
      <div v-if="category==='EXOPET'||category==='Todos'" class="exopet-banner"><div class="exopet-copy"><span class="eyebrow"><i></i> UNA CATEGORÍA CON HUELLITAS</span><h2>EXO<em>PET</em></h2><p>Llaveros y detalles inspirados en tus compañeros de cuatro patas. Personalizamos modelos para llevar a tu mascota contigo.</p><button class="button button-primary" @click="category='EXOPET'">Explorar EXOPET <span>→</span></button></div><div class="exopet-photos"><img src="/images/exopet/GOLDEN.png" alt="Golden retriever"><img src="/images/exopet/Beagle.jpeg" alt="Beagle"><img src="/images/exopet/PUG.jpeg" alt="Pug"></div></div>
    </section>
    </div>
div>
</template>
