<template>
  <q-page class="flex flex-center">
<template>
  <div class="q-pa-md" style="max-width: 400px">

      <q-input
        filled
        v-model="full_name"
        label="Nom complet"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'No pot haber cadena buida']"
        />

      <q-input
        filled
        v-model="dni"
        label="DNI"
        lazy-rules
        :rules="[
         val => val && val.length > 0  || 'No pot haber cadena buida',
         val => isValid && val.length == 9 || 'Ha de contenir 8 numeros i 1 lletra']"
       />

       <q-input
        filled
        v-model="username"
        label="Usuari"
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
      <q-input
        filled
        v-model="passwordCompara"
        label="Contrasenya"
        type="password"
        lazy-rules
        :rules="[
         val => val && val.length > 0  || 'No pot haber cadena buida',
         val => val == password || 'No coincidix']"
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
      full_name: '',
      dni: '',
      username: '',
      password: '',
      passwordCompara: ''
    }
  },
  computed: {
    isValid () {
      const exp = new RegExp('[0-9]{8}[A-Z]')
      return exp.test(this.dni)
    }
  }
}
</script>
