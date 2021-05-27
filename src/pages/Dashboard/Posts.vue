<template>
  <div>
    <div class="header text-center">
      <h3 class="title"></h3>
      <p class="category">
        Bienvenido a este super Blog. 
      </p>
      <div class="alert alert-rose alert-with-icon"
              data-notify="container"
            >
              <i data-notify="icon" class="material-icons">add_alert</i>
              <span data-notify="message"
                >Aqui podras encontrar noticias maravillosas acerca del mundo. No tardes mas, postea con nosotros todo lo que quieras.</span
              >
        </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-100 md-small-size-100">
        <md-card>
          <md-card-content>
            <div v-for="d in data" :key="d.id" class="alert alert-with-icon" :class="d.color" data-notify="container">
                <i data-notify="icon" class="material-icons">{{d.icon}}</i>
                <span data-notify="message">
                  <strong>{{ d.title }}</strong><br/><br/>
                  {{ d.content }}<br/><br/>
                  Publicado en {{d.created_at}}
                </span>
                <span data-notify="message">
                </span>
            </div>
          </md-card-content>
        </md-card>
       
      </div>

    </div>
  </div>
</template>



<script>
  export default {
    created() {
      this.getData();
    },
    data() {
        return{
            data:null,
        }
    },
    methods: {
        async getData() {
          try {
              await this.$store.dispatch("post/getPost");
              // Just show the last fives posts
              this.data=this.$store.state.post.list.slice(-5);
              for(let i = 0; i < this.data.length; i++){
                  this.data[i].created_at= new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(this.data[i].created_at)))
              }
          } catch (e) {
              await this.$store.dispatch("alerts/error", "Error en obtener los datos");
          }
        }
    },
  }
</script>

<style lang="scss">
.text-center {
  text-align: center;
}

.places-buttons + div .md-button:not(:last-child) {
  margin-right: 5px;
}
</style>
