<template>
  <q-list separator>
    <q-item v-for="idx in 5" :key="idx" clickable class="q-pa-md">
      <q-item-section>
        <q-item-label class="flex justify-between items-center">
          <span>
            <q-skeleton width="60px" height="10px" />
          </span>
          <span class="text-caption">
            <q-skeleton width="40px" height="10px" />
          </span>
        </q-item-label>
        <q-item-label caption lines="1">
          <q-skeleton width="70%" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
