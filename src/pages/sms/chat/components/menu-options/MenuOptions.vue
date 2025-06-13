<template>
  <q-menu>
    <q-list separator>
      <q-item v-close-popup clickable @click="favoriteChat(contact.contactId)">
        <q-item-section>
          {{
            contact.favorite
              ? 'Remover dos favoritos'
              : 'Adicionar aos favoritos'
          }}
        </q-item-section>
      </q-item>
      <q-item
        v-close-popup
        clickable
        class="text-negative"
        @click="openDeleteDialog(contact)"
      >
        <q-item-section> Deletar </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import { IContactChatSMS } from 'src/types/sms/IChatSMS.type'
import { useChatSMS } from '../../useChatSMS'

interface IProps {
  contact: IContactChatSMS
}

defineProps<IProps>()

const { favoriteChat, openDeleteDialog } = useChatSMS()
</script>
