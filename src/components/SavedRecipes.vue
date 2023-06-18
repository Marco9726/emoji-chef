<script>
name: 'SavedRecipes';
import { store } from '../store';
export default {
   data() {
      return {
         store,
      };
   },
   mounted() {},
};
</script>

<template>
   <section class="savedRecipes container">
      <!-- se non sono presenti ricette -->
      <h2 v-if="store.savedRecipes.length == 0">
         Non shai ancora salvato alcuna ricetta
      </h2>

      <!-- altrimenti, le mostro -->
      <div v-else class="recipes">
         <!-- ciclo delle ricette -->
         <article
            class="recipe-card border-blue d-flex mb-3"
            v-for="(item, index) in store.savedRecipes"
            :key="index"
         >
            <div class="thumbnail">
               <img
                  :src="item.imageUrl"
                  alt="recipe-image"
                  class="h-100 w-100"
               />
            </div>
            <div class="card-content p-3 bg-white text-start">
               <div class="title">
                  <h4>c{{ item.titolo }}</h4>
               </div>
               <div class="emoji">
                  {{ item.emoji }}
               </div>
            </div>
         </article>
      </div>
   </section>
</template>

<style lang="scss">
section.savedRecipes {
   .recipes {
      overflow-y: scroll;
      article.recipe-card {
         border-radius: 1.5rem;

         .thumbnail {
            width: calc(100% / 3);
            img {
               border-radius: 1.5rem 0 0 1.5rem;
            }
         }

         .card-content {
            width: calc(100% / 3 * 2);
            border-radius: 0 1.5rem 1.5rem 0;
            h4 {
               font-weight: 600;
               color: #2619aa;
            }
         }
      }
   }
}
</style>
