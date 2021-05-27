<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header" >
        <div name="header">
          Post
        </div>
        <button
          type="button"
          class="btn-close"
          @click="close"
        >
          x
        </button>
      </header>

      <section class="modal-body">
        <div name="body">
         <form ref="post_form" @submit.prevent="sendData">
            <md-card>

              <md-card-header class="md-card-header-icon">
                <div class="card-icon">
                  <md-icon>build</md-icon>
                </div>
                <h4 class="title">
                  Editar post
                </h4>
              </md-card-header>

              <md-card-content>
                <div class="md-layout">
                  <div class="md-layout-item md-size-100">
                    <ValidationProvider rules="min:3|max:15" v-slot="{ errors }">
                      <md-field class="md-invalid">
                        <label>Titulo</label>
                          <md-input v-if="item!=null" v-model="item.title" type="text" maxlength="15" :value="item.title"/>
                      </md-field>
                      <span>{{ errors[0] }}</span>
                    </ValidationProvider>
                     <ValidationProvider rules="min:3|max:15" v-slot="{ errors }">
                      <md-field class="md-invalid" rules="min:3|max:100">
                        <label>Contenido</label>
                        <md-textarea v-if="item!=null" v-model="item.content" type="text" :value="item.content"/>
                      </md-field>
                      <span>{{ errors[0] }}</span>
                     </ValidationProvider>
                    <md-field class="md-invalid">
                      <label>Status</label>
                      <md-select v-if="item!=null" v-model="item.statusId" name="estatus" :value="item.statusId">
                        <md-option
                          v-for="itemT in statusOptions"
                          :key="itemT.id"
                          :label="itemT.name"
                          :value="itemT.id"
                        >
                          {{ itemT.name }}
                        </md-option>
                      </md-select>
                    </md-field>
                  </div>
                </div>
              </md-card-content>

              <md-card-actions>
                <md-button type="button" @click="close">
                 Cerrar
                </md-button>
                <md-button class="md-success" type="submit">
                  Enviar
                </md-button>
              </md-card-actions>
            </md-card>

          </form>
        </div>
       </section>

     
    </div>
  </div>
</template>

<script>
  import { ValidationProvider } from 'vee-validate';
  import { extend,max } from 'vee-validate';
  
  extend('min', {
    validate(value, args) {
      return value.length >= args.length;
    },
    params: ['length'],
    message:"Este campo debe ser mayor a 3 caracteres"
  });
  extend('max', {
    validate(value, args) {
      return value.length <= args.length;
    },
    params: ['length'],
    message:"Este campo debe ser menor a 15 caracteres"
  });
  extend('required', {
    validate(value, args) {
     return value ? true : 'This field is required';
    },
    message:"Este campo es requerido"
  });
 

  export default {
    components: {ValidationProvider},
    name: 'Modal',
    props: {
      item : Object
    },
    data: () => ({
      user: null,
      statusOptions: [{id: 1,name: "Publicar"} , {id: 3, name:"Borrador"}, {id: 2, name:"Inactivo"}],

    }),
    methods: {
      close() {
        this.$emit('close');
      },
      async sendData() {
          try {
            if(this.item.title != null && this.item.content != null && this.item.title.length > 3 && this.item.content.length > 3){
                await this.$store.dispatch("profile/me")
                let userd = await this.$store.getters["profile/me"];
                let data={
                  user: userd.id,
                  title: this.item.title,
                  content: this.item.content,
                  status:this.item.statusId,
                  id: this.item.id
                }

                await this.$store.dispatch("post/update",data);
                await this.$store.dispatch("alerts/success", "Post enviado exitosamente");
                this.$refs['post_form'].reset();
                this.$emit('updateTable');
                this.$emit('close');

            }else{
              await this.$store.dispatch("alerts/error", "Debes llenar todos los campos correctamente");
            }

          } catch (e) {
              await this.$store.dispatch("alerts/error", "Error en obtener los datos");
          }
        }
    },
  };
</script>

<style>

  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    width: 60%;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>Guardar