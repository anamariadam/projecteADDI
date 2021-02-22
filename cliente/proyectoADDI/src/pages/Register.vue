<template>
  <q-page class="flex flex-center">
<template>
  <div class="q-pa-md" style="max-width: 400px">

      <q-input
        filled
        v-model="name"
        label="Nom complet"
        clearable:false
        />

      <q-input
        filled
        v-model="dni"
        label="DNI"
        clearable:false
       />

       <q-input
        filled
        v-model="username"
        label="Usuari"
        clearable:false
      />

      <q-input
        filled
        v-model="password"
        label="Contrasenya"
        type="password"
      />
      <q-card-actions class="q-px-md">
            <q-btn unelevated color="primary" size="lg" class="full-width" label="Registra't" />
          </q-card-actions>

  </div>
</template>

  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      name: '',
      dni: '',
      username: '',
      password: ''
    }
  }
}
</script>
