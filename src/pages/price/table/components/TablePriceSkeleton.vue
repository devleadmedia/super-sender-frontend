<template>
  <q-card-section>
    <div class="text-subtitle1 text-bold">
      <q-skeleton type="text" width="20%" />
    </div>
    <q-markup-table separator="cell" flat bordered>
      <thead>
        <tr>
          <th class="text-left"><q-skeleton type="text" width="20%" /></th>
          <th class="text-left"><q-skeleton type="text" width="20%" /></th>
          <th class="text-left"><q-skeleton type="text" width="20%" /></th>
          <th class="text-right"><q-skeleton type="text" width="20%" /></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="idx in 5" :key="idx">
          <td class="text-left">
            <q-skeleton type="text" width="50%" />
          </td>
          <td class="text-left">
            <q-skeleton type="text" width="30%" />
          </td>
          <td class="text-left">
            <q-skeleton type="text" width="60%" />
          </td>
          <td class="text-right">
            <q-skeleton type="text" width="70%" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</template>
