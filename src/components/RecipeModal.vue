<script>
name: 'RecipeModal';
import { store } from '../store';
export default {
   data() {
      return {
         store,
         saveButton: null,
      };
   },
   methods: {
      hideModal() {
         const MODAL = document.querySelector('.overlay-modal');
         MODAL.classList.add('d-none');
         this.saveButton.dataset.action = 'save';
      },
      setModalAction() {
         if (this.saveButton.dataset.action == 'save') {
            this.saveRecipe();
            this.saveButton.dataset.action = 'remove';
         } else {
            this.removeRecipe();
            this.saveButton.dataset.action = 'save';
         }
      },
      saveRecipe() {
         this.store.recipe.imageUrl = this.optimizeBase64Image(0.3);
         this.store.savedRecipes.push(store.recipe);
         this.updateStorage();
      },
      removeRecipe() {
         const index = this.store.savedRecipes.indexOf(store.recipe);
         this.store.savedRecipes.splice(index, 1);
         this.updateStorage();
      },
      updateStorage() {
         localStorage.setItem(
            this.store.STORAGE_KEY,
            JSON.stringify(this.store.savedRecipes)
         );
      },
      optimizeBase64Image(quality) {
         const image = document
            .querySelector('.recipe-image')
            .querySelector('img');
         console.log(image);

         const canvas = document.createElement('canvas');
         canvas.height = image.naturalHeight;
         canvas.width = image.naturalWidth;

         const context = canvas.getContext('2d');
         context.drawImage(image, 0, 0);

         return canvas.toDataURL('image/jpeg', quality);
      },
   },
   mounted() {
      this.saveButton = document.querySelector('.modal-save-button');
   },
};
</script>

<template>
   <div class="overlay overlay-modal d-none">
      <div class="my-modal border-blue bg-white">
         <!-- close button -->
         <div class="modal-close-button border-blue" @click="hideModal">
            <img src="../../public/close-button.svg" alt="close-button" />
         </div>

         <!-- save button -->
         <div
            class="modal-save-button"
            data-action="save"
            @click="setModalAction()"
         >
            <i class="fa-solid fa-bookmark action-save"></i>
            <i class="fa-regular fa-bookmark action-remove"></i>
         </div>

         <div class="recipe-image h-50">
            <img :src="store.recipe.imageUrl" alt="" class="h-100 w-100" />
         </div>

         <div class="recipe-content p-3">
            <h2>{{ store.recipe.titolo }}</h2>
            <div class="mb-2">
               <strong>Ingredienti: </strong>
               <ul>
                  <li
                     v-for="(item, index) in store.recipe.ingredienti"
                     :key="index"
                  >
                     {{ item }}
                  </li>
               </ul>
            </div>
            <div>
               <strong>Procedimento: </strong>
               <p>
                  {{ store.recipe.procedimento }}
               </p>
            </div>
         </div>
      </div>
   </div>
</template>

<style lang="scss">
.overlay-modal {
   .my-modal {
      position: relative;
      height: 90%;
      width: 90%;
      overflow-y: auto;
      overscroll-behavior: contain;

      .modal-close-button {
         background-color: #eeb9f5;
         border-radius: 100%;
         height: 2rem;
         width: 2rem;
         display: flex;
         cursor: pointer;
         padding: 0.3rem;
         position: absolute;
         top: 15px;
         right: 15px;
      }

      .modal-save-button {
         position: absolute;
         top: 15px;
         left: 15px;
         font-size: 3rem;
         color: #1212b2;
         cursor: pointer;
         transition: color 0.2s ease-in-out;
      }

      [data-action='save'] > :not(.action-remove) {
         display: none;
      }

      [data-action='remove'] > :not(.action-save) {
         display: none;
      }

      .recipe-image {
         background-image: url('../../public/loader.gif');
         background-position: center;
         background-repeat: no-repeat;
      }

      .recipe-content {
         text-align: left;
         // color: #1212b2;
         h2 {
            font-weight: 700;
         }
      }
   }
}
</style>
