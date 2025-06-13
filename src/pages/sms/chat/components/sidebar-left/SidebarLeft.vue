<template>
  <div class="q-pa-md">
    <b>Conversas</b>

    <q-input
      class="q-mt-md"
      v-bind="$vInput"
      :outlined="false"
      filled
      v-model="state.sidebar.search"
      placeholder="Pesquisar"
    >
      <template #append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="flex justify-center q-mt-sm gap-sm">
      <q-btn
        label="Tudo"
        outline
        rounded
        size="10px"
        :color="isActiveOption('all')"
        @click="setFilterByOption('all')"
      />
      <q-btn
        label="Não lidas"
        outline
        rounded
        size="10px"
        :color="isActiveOption('unRead')"
        @click="setFilterByOption('unRead')"
      />
      <q-btn
        label="Favoritas"
        outline
        rounded
        size="10px"
        :color="isActiveOption('favorites')"
        @click="setFilterByOption('favorites')"
      />
    </div>
  </div>

  <q-separator />

  <q-infinite-scroll class="full-height overflow-auto">
    <conversation-skeleton v-if="loaderStatus(loader.list)" />

    <template v-for="(item, idx) in currentList" :key="idx">
      <q-item
        @click="openChat(item)"
        clickable
        :class="
          item.contactId === state.chat?.contact.contactId
            ? 'item-conversation-active'
            : ''
        "
        class="item-conversation q-pa-sm"
      >
        <q-item-section>
          <q-item-label class="flex justify-between items-center">
            <span>{{ formatPhoneNumber(item.telephone) }}</span>
            <span class="text-caption" style="font-size: 10px">
              {{ formatDate(item.lastMessageDate) }}
            </span>
          </q-item-label>
          <q-item-label
            caption
            lines="1"
            class="bottom-content flex no-wrap items-center gap-md justify-between"
          >
            <span :title="item.lastMessage" class="ellipsis last-message">
              {{ item.lastMessage }}
            </span>
            <span class="flex items-center gap-sm no-wrap">
              <q-icon v-if="item.favorite" name="star" size="12px" />

              <q-chip
                v-if="item.newMessagens"
                color="primary"
                dense
                :label="item.newMessagens"
                size="10px"
              />

              <div @click.stop :id="`more-icon-${idx}`">
                <q-btn
                  class="btn-more-options"
                  flat
                  icon="expand_more"
                  dense
                  size="10px"
                >
                  <menu-options :target="`#more-icon-${idx}`" :contact="item" />
                </q-btn>
              </div>
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator v-if="idx != currentList.length - 1" />
    </template>
  </q-infinite-scroll>
</template>
<script setup lang="ts">
import { formatDate } from 'src/utils/date.util'
import { formatPhoneNumber } from 'src/utils/text.util'
import { computed } from 'vue'
import MenuOptions from '../menu-options/MenuOptions.vue'
import { useLoader } from 'src/composables/useLoader'
import { useChatSMS } from '../../useChatSMS'
import { loader } from '../../chatSMS.const'
import ConversationSkeleton from './ConversationSkeleton.vue'

const { loaderStatus } = useLoader()

const currentList = computed(() => {
  const { search, filterBy } = state.value.sidebar
  return state.value.list.filter((item) => {
    const matchSearch = search
      ? item.lastMessage.includes(search) || item.telephone.includes(search)
      : true

    const matchUnRead = filterBy === 'unRead' ? item.newMessagens > 0 : true
    const matchFavorite = filterBy === 'favorites' ? item.favorite : true

    return matchSearch && matchUnRead && matchFavorite
  })
})

const { state, setFilterByOption, isActiveOption, openChat } = useChatSMS()
</script>
<style lang="scss">
.item-conversation-active {
  > .q-focus-helper {
    opacity: 0.22 !important;
    background: currentColor;
  }
}

.item-conversation {
  height: 72px;

  .bottom-content {
    height: 20px;
  }

  .last-message {
    font-size: 12px;
  }

  .btn-more-options {
    display: none;
  }

  &:hover .btn-more-options {
    display: initial;
  }
}
</style>
