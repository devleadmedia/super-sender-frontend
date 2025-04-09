<template>
  <q-scroll-area class="fit">
    <q-item style="height: 60px" :active="false" to="/">
      <q-img :src="logo" width="130px" />
    </q-item>
    <template v-for="(menuItem, index) in menuOptions" :key="index">
      <!-- v-if="handleRoles(menuItem.roles)" -->
      <q-item
        v-if="!menuItem.children.length"
        active-class="active-item-menu"
        :to="menuItem.to"
        clickable
        v-ripple
        :disable="menuItem?.disable"
      >
        <q-item-section avatar>
          <q-icon :name="menuItem.icon" />
        </q-item-section>
        <q-item-section>
          {{ menuItem.name }}
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-else
        :model-value="false"
        :icon="menuItem.icon"
        :label="menuItem.name"
      >
        <q-item
          v-for="(itemChild, idx) in menuItem.children"
          :key="idx"
          clickable
          v-ripple
          icon
          to="/app/advertiser"
        >
          <div class="text-h5 q-mr-sm">•</div>
          <q-item-section>
            {{ itemChild.name }}
          </q-item-section>
        </q-item>
      </q-expansion-item>
      <q-separator :key="'sep' + index" v-if="menuItem.separator" />
    </template>
  </q-scroll-area>
</template>
<script setup lang="ts">
import logo from 'assets/img/logo/supersender.png'
import { menuOptions } from '../constants/menuOptions.const'
/*
import { Roles } from 'src/enums/roles.enum'
import { useLocalStorage } from 'src/composables/useLocalStorage'
import { LocalStorageKey } from 'src/enums/LocalStorageKey.enum'

function handleRoles(roles: Roles[]) {
  const { getLocalStorage } = useLocalStorage()

  const userRoles: Roles[] =
    JSON.parse(getLocalStorage(LocalStorageKey.user)).roles || []

  if (userRoles.includes(Roles.admin)) return true

  return roles.some((role) => userRoles.includes(role))
} */
</script>
<style lang="scss">
// ACTIVE EXPANDED
.q-item[aria-expanded='true'] {
  .q-item__section,
  .icon-point {
    color: $primary !important;
  }
}

// COLLAPSE
.q-expansion-item__content {
  margin-left: 27px;
  border-left: 1px solid $separator-color;

  .q-expansion-item__content {
    margin-left: 19px;
  }
}
</style>
