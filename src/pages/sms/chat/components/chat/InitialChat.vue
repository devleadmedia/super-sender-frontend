<template>
  <div class="flex justify-center items-center fit">
    <div class="flex justify-center">
      <q-img :src="imageLogo" />
      <p class="q-mb-none text-center">
        Clique em uma conversa para carregar as mensagens
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import imageLogo from 'src/assets/img/logo/supersender.png'
</script>
