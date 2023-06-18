<script>
name: 'CreateRecipe';
import { config } from '../config';
import { store } from '../store';
export default {
   data() {
      return {
         config,
         store,
         saveButton: null,
         ingredients: [
            '🥩',
            '🍅',
            '🧀',
            '🍆',
            '🥦',
            '🐟',
            '🥑',
            '🍗',
            '🥕',
            '🥬',
            '🥚',
            '🥔',
         ],
         bowlSlots: [],
         STORAGE_KEY: 'saved_recipes',
         // parametri richiesta API
         BASE_URL: 'https://api.openai.com/v1',
         CHAT_ENDPONT: '/chat/completions',
         IMAGE_ENDPOINT: '/images/generations',
         APY_KEY: '',
         temperature: 0.2,
         MODEL: 'gpt-3.5-turbo',
         //dati risposta chiamata
         recipe: {},
      };
   },
   methods: {
      addIngredient(ingr) {
         if (this.bowlSlots.length < 3) {
            this.bowlSlots.push(ingr);
         }
      },
      async makeRequest(endpoint, payload) {
         const response = await fetch(this.BASE_URL + endpoint, {
            method: 'POST',
            headers: {
               'Content-type': 'application/json',
               Authorization: `Bearer ${this.APY_KEY}`,
            },
            body: JSON.stringify(payload),
         });

         const json = await response.json();

         return json;
      },
      async createRecipe() {
         const LOADING = document.querySelector('.overlay-loading');
         const MODAL = document.querySelector('.overlay-modal');
         //1) mostro il loader
         LOADING.classList.remove('d-none');
         const prompt = `\
			Crea una ricetta con questi ingredienti: ${this.bowlSlots.join('')}.
			La tua ricetta deve essere facile e con un titolo creativo e divertente.
			Le tue risposto sono solo in formato JSON come qeusto:\n\n###\n\n{"titolo": "Titolo ricetta","ingredienti": ["1 uovo ,1 pomodoro"],"procedimento": "Mescola gli ingredienti e metti in forno"}###`;
         //2) chiamata OPENAI
         const recipeResponse = await this.makeRequest(this.CHAT_ENDPONT, {
            model: this.MODEL,
            messages: [
               {
                  role: 'user',
                  content: prompt,
               },
            ],
         });

         this.recipe = JSON.parse(recipeResponse.choices[0].message.content);
         this.recipe.emoji = this.bowlSlots.join(' ');
         console.log(this.recipe.emoji);
         console.log(this.recipe.ingredienti);

         //3) chiamata per generare l'immagine
         const imageResponse = await this.makeRequest(this.IMAGE_ENDPOINT, {
            prompt: this.recipe.titolo,
            n: 1,
            size: '512x512',
            response_format: 'b64_json',
         });

         const imageUrl = imageResponse.data[0].b64_json;
         this.recipe.imageUrl = `data:image/png;base64, ${imageUrl}`;

         //4) nasconto il loader
         LOADING.classList.add('d-none');
         //5) mostro la modale
         MODAL.classList.remove('d-none');

         this.clearBowl();
      },
      hideModal() {
         const MODAL = document.querySelector('.overlay-modal');
         MODAL.classList.add('d-none');
         this.saveButton.dataset.action = 'save';
      },
      clearBowl() {
         this.bowlSlots = [];
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
         store.savedRecipes.push(this.recipe);
         this.updateStorage();
      },
      removeRecipe() {
         const index = this.store.savedRecipes.indexOf(this.recipe);
         this.store.savedRecipes.splice(index, 1);
         this.updateStorage();
      },
      updateStorage() {
         localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(this.store.savedRecipes)
         );
      },
   },
   mounted() {
      this.APY_KEY = config.KEY;
      // this.saveRecipeButton = document.getElementById('save');
      // this.removeRecipeButton = document.getElementById('removeSave');
      this.saveButton = document.querySelector('.modal-save-button');

      const storage = localStorage.getItem(this.STORAGE_KEY);
      if (storage) {
         this.savedRecipes = JSON.parse(storage);
      }
   },
};
</script>

<template>
   <!-- section create recipe -->
   <section class="createRecipe container">
      <!-- loading-->
      <div class="overlay overlay-loading d-none">
         <img src="../../public/cook.gif" alt="loading" />
      </div>

      <!-- modal -->
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
               <img :src="recipe.imageUrl" alt="" class="h-100 w-100" />
            </div>
            <div class="recipe-content p-3">
               <h2>{{ this.recipe.titolo }}</h2>
               <div class="mb-2">
                  <strong>Ingredienti: </strong>
                  <ul>
                     <li
                        v-for="(item, index) in recipe.ingredienti"
                        :key="index"
                     >
                        {{ item }}
                     </li>
                  </ul>
               </div>
               <div>
                  <strong>Procedimento: </strong>
                  <p>
                     {{ this.recipe.procedimento }}
                  </p>
               </div>
            </div>
         </div>
      </div>

      <!-- griglia ingredienti -->
      <div class="ingredients d-flex flex-wrap justify-content-center">
         <!-- ciclo gli ingredienti -->
         <div
            class="ingredient border-blue"
            v-for="(item, index) in ingredients"
            :key="index"
            @click="addIngredient(item)"
         >
            {{ item }}
         </div>
      </div>

      <!-- bowl -->
      <div class="bowl bg-white border-blue">
         <div class="bowl-slot">{{ bowlSlots[0] ? bowlSlots[0] : '?' }}</div>
         <div class="bowl-slot">{{ bowlSlots[1] ? bowlSlots[1] : '?' }}</div>
         <div class="bowl-slot">{{ bowlSlots[2] ? bowlSlots[2] : '?' }}</div>
      </div>

      <!-- button -->
      <button
         class="text-white cook-button"
         @click="createRecipe()"
         v-if="bowlSlots.length == 3"
      >
         Crea ricetta!
      </button>
   </section>
</template>

<style lang="scss">
.createRecipe {
   .ingredients {
      gap: 10px;
      .ingredient {
         border-radius: 1.375rem;
         background-color: #b2d1fb;
         height: 80px;
         width: 80px;
         font-size: 40px;
         line-height: 2;
         cursor: pointer;
      }
   }

   .bowl {
      height: 80px;
      border-radius: 1.375rem;
      color: #b2d1fb;
      font-weight: 700;
      font-size: 40px;
      line-height: 2;

      .bowl-slot {
         display: inline-block;
         width: calc(100% / 3);
         height: 100%;

         &:nth-child(2) {
            border-left: 2px solid #2619aa;
            border-right: 2px solid #2619aa;
         }
      }
   }

   button {
      border-radius: 1.5rem;
      border: none;
      padding: 8px 24px;
      background-color: #2619aa;
      font-weight: 700;
      font-size: 1.2rem;
   }
}

.overlay {
   position: fixed;
   top: 0;
   right: 0;
   bottom: 0;
   left: 0;
   background-color: rgba(255, 255, 255, 0.8);
   z-index: 3;
   display: flex;
   justify-content: center;
   align-items: center;
   margin-bottom: 0;
   &.overlay-loading {
      img {
         width: 200px;
      }
   }
   &.overlay-modal {
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
}

@media screen and (min-width: 500px) {
   .overlay-modal {
      .my-modal {
         width: 450px !important;
      }
   }
}
</style>
