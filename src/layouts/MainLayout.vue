<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toggle
          v-model="lightTheme"
          checked-icon="light_mode"
          color="amber"
          unchecked-icon="nights_stay"
          @update:model-value="toggleTheme"
        />
        <!--        <q-btn-->
        <!--          flat-->
        <!--          dense-->
        <!--          round-->
        <!--          icon="menu"-->
        <!--          aria-label="Menu"-->
        <!--          @click="toggleLeftDrawer"-->
        <!--        />-->

        <!--        <q-toolbar-title>-->
        <!--          Quasar App-->
        <!--        </q-toolbar-title>-->

        <!--        <div>Quasar v{{ $q.version }}</div>-->
      </q-toolbar>
    </q-header>

    <!--    <q-drawer-->
    <!--      v-model="leftDrawerOpen"-->
    <!--      show-if-above-->
    <!--      bordered-->
    <!--    >-->
    <!--      <q-list>-->
    <!--        <q-item-label-->
    <!--          header-->
    <!--        >-->
    <!--          Essential Links-->
    <!--        </q-item-label>-->

    <!--        <EssentialLink-->
    <!--          v-for="link in essentialLinks"-->
    <!--          :key="link.title"-->
    <!--          v-bind="link"-->
    <!--        />-->
    <!--      </q-list>-->
    <!--    </q-drawer>-->

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent, ref} from 'vue'
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'MainLayout',

  components: {
    // EssentialLink
  },

  setup() {
    //variable
    const $q = useQuasar();
    const lightTheme = ref(true)

    //created
    let light = JSON.parse(localStorage.getItem("lightTheme"));
    if (light !== null && light !== undefined) {
      lightTheme.value = light;
    } else {
      lightTheme.value = !$q.dark.isActive;
    }
    $q.dark.set(!lightTheme.value);

    //methods
    function toggleTheme() {
      $q.dark.toggle();
      localStorage.setItem("lightTheme", JSON.stringify(lightTheme.value));
    }

    return {
      lightTheme,
      toggleTheme,

      // essentialLinks: linksList,
      // leftDrawerOpen,
      // toggleLeftDrawer () {
      //   leftDrawerOpen.value = !leftDrawerOpen.value
      // }
    }
  }
})
</script>
