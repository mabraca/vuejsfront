<template>
  <div class="md-layout">
      
    <div class="md-layout-item md-size-100">
      
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Lista de posts</h4>
        </md-card-header>
        <md-card-content>
          <div class="text-right">
            <md-button class="md-primary md-dense" @click="showModal">
              Añadir post
            </md-button>
          </div>
          <md-table
            :value="table"
            :md-sort.sync="sortation.field"
            :md-sort-order.sync="sortation.order"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
          >
            <md-table-toolbar>
              <md-field>
                <label>Por página</label>
                <md-select v-model="pagination.perPage" name="pages">
                  <md-option
                    v-for="item in pagination.perPageOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                    {{ item }}
                  </md-option>
                </md-select>
              </md-field>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Titulo" md-sort-by="title">{{
                item.title
              }}</md-table-cell>
              <md-table-cell md-label="Contenido" md-sort-by="content">{{
                item.content
              }}</md-table-cell>
              <md-table-cell md-label="Estatus" md-sort-by="status">{{
                item.status
              }}</md-table-cell>
              <md-table-cell md-label="Creado" md-sort-by="created_at">{{
                item.created_at
              }}</md-table-cell>
              <md-table-cell md-label="Actualizado" md-sort-by="updated_at">{{
                item.updated_at
              }}</md-table-cell>
              <md-table-cell md-label="Acciones">
                <md-button
                  class="md-icon-button md-raised md-round md-info"
                  @click="showModalEditar(item)"
                  style="margin: 0.2rem"
                >
                  <md-icon>edit</md-icon>
                </md-button>
                <md-button
                  class="md-icon-button md-raised md-round md-danger"
                  @click="deleteItem(item)"
                  style="margin: 0.2rem"
                >
                  <md-icon>delete</md-icon>
                </md-button>
              </md-table-cell>
              
            </md-table-row>
          </md-table>

          <div class="footer-table md-table">
            <table>
              <tfoot>
                <tr>
                  <th
                    v-for="item in footerTable"
                    :key="item.name"
                    class="md-table-head"
                  >
                    <div class="md-table-head-container md-ripple md-disabled">
                      <div class="md-table-head-label">
                        {{ item }}
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </md-card-content>

        <md-card-actions md-alignment="space-between">
          <div class="">
            <p class="card-category">
              Desplegando {{ from + 1 }} a {{ to }} de {{ total }} registros
            </p>
          </div>
          
          <pagination
            class="pagination-no-border pagination-success"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          />
        </md-card-actions>
      </md-card>
    </div>
    <modalAgregar
      v-show="isModalVisible"
      :puser= "user"
      @close="closeModal"
      @updateTable="getList"
    />

    <modalEditar
        v-show="isModalEditarVisible"
        :item= "objectToPass"
        @close="closeModalEditar"
        @updateTable="getList"
        />
    
  </div>
</template>

<script>
import PaginationPost from "@/components/PaginationPost";
import ModalAgregarPost from '@/components/ModalAgregarPost.vue';
import ModalEditarPost from '@/components/ModalEditarPost.vue';
import Swal from "sweetalert2";

export default {
    components: {
        pagination: PaginationPost,
        modalAgregar: ModalAgregarPost,
        modalEditar : ModalEditarPost

    },

    data: () => ({
        table: [],
        footerTable: ["Titulo", "Contenido", "Estatus", "Creado","Actualizado","Acciones"],
        user : null,
        query: null,

        sortation: {
            field: null,
            order: null,
        },
        pagination: {
            perPage: 5,
            currentPage: 1,
            perPageOptions: [5, 10, 25, 50],
        },
        total: 1,
        isModalVisible: false,
        isModalEditarVisible: false,
        isModalEliminarVisible: false,
        objectToPass: null,
    }),

    computed: {
        sort() {
            if (this.sortation.order === "desc") {
                return `-${this.sortation.field}`;
            }

            return this.sortation.field;
        },

        from() {
            return this.pagination.perPage * (this.pagination.currentPage - 1);
        },

        to() {
            
            let highBound = this.from + this.pagination.perPage;
            if (this.total < highBound) {
                highBound = this.total;
            }

            return highBound;
        },
    },

    beforeMount() {
        this.getList();
    },

    methods: {
        async getList() {
            try {
                await this.$store.dispatch("post/getPostAdmin");
                this.table = this.$store.state.post.list;
                this.total = this.table.length;
                for(let i = 0; i < this.table.length; i++){
                   this.table[i].created_at= new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(this.table[i].created_at)))
                   this.table[i].updated_at= new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(this.table[i].updated_at)))

                }
            } catch (e) {
                await this.$store.dispatch("alerts/error", "Error en obtener los datos");
            }
        },
        async deletePost(id) {
            try {
                await this.$store.dispatch("post/destroy",id);
                Swal.fire('Post eliminado exitosamente', '', 'success');
                this.getList();
            } catch (e) {
                await this.$store.dispatch("alerts/error", "Error en obtener los datos");
            }
        },


        customSort() {
            return false;
        },
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
        showModalEditar(item) {
            this.isModalEditarVisible = true;
            this.objectToPass = item;
        },
        closeModalEditar() {
            this.isModalEditarVisible = false;
        },
        deleteItem(item){

            Swal.fire({
                title: '¿Seguro que quieres eliminar este post? ',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: `Eliminar`,
                denyButtonText: `Cerrar`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.value) {
                    this.deletePost(item.id);
                }
            });


        }
    },
};
</script>
<style>
#pro-feature {
  font-weight: bold;
}
</style>
