<template>
  <q-page class="flex flex-center">
<div>
  <div class="q-pa-md" style="max-width: 400px">

      <q-input
        filled
        v-model="username"
        label="Usuari"
        hint="usuari"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'No pot haber cadena buida']"
      />

      <q-input
        filled
        v-model="password"
        label="Contrasenya"
        type="password"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'No pot haber cadena buida']"
      />

      <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">No estas registrat?<a href="#/Register">Registra't</a></p>
          </q-card-section>

  </div>
</div>
  </q-page>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  }
}
</script>
