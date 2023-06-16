<script>
import { config } from './config';
import Header from './components/Header.vue';
export default {
   components: {
      Header,
   },
   data() {
      return {
         config,
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
         // parametri richiesta API
         BASE_URL: 'https://api.openai.com/v1',
         CHAT_ENDPONT: '/chat/completions',
         IMAGE_ENDPOINT: '/images/generations',
         APY_KEY: '',
         temperature: 0.2,
         MODEL: 'gpt-3.5-turbo',
         //dati risposta chiamata
         recipe: {},
         recipeIngredients: [],
         imageUrl: '',
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
			Le tue risposto sono solo in formato JSON come qeusto:\n\n###\n\n{"titolo": "Titolo ricetta","ingredienti": "1 uovo 1 pomodoro","procedimento": "Mescola gli ingredienti e metti in forno"}###`;
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

         this.recipeIngredients = this.recipe.ingredienti.split(',');

         //3) chiamata per generare l'immagine
         const imageResponse = await this.makeRequest(this.IMAGE_ENDPOINT, {
            prompt: this.recipe.titolo,
            n: 1,
            size: '512x512',
         });

         this.imageUrl = imageResponse.data[0].url;

         //4) nasconto il loader
         LOADING.classList.add('d-none');
         //5) mostro la modale
         MODAL.classList.remove('d-none');

         this.clearBowl();
      },
      hideModal() {
         const MODAL = document.querySelector('.overlay-modal');
         MODAL.classList.add('d-none');
      },
      clearBowl() {
         this.bowlSlots = [];
      },
   },
   mounted() {
      this.APY_KEY = config.KEY;
   },
};
</script>

<template>
   <Header></Header>

   <!-- loading-->
   <div class="overlay overlay-loading d-none">
      <img src="../public/cook.gif" alt="loading" />
   </div>

   <!-- modal -->
   <div class="overlay overlay-modal d-none">
      <div class="my-modal border-blue bg-white">
         <div class="modal-close-button" @click="hideModal">
            <img src="../public/close-button.svg" alt="close-button" />
         </div>
         <div class="recipe-image h-50">
            <img :src="imageUrl" alt="" class="h-100 w-100" />
         </div>
         <div class="recipe-content p-3">
            <h2>{{ this.recipe.titolo }}</h2>
            <div class="mb-2">
               <strong>Ingredienti: </strong>
               <ul>
                  <li v-for="(item, index) in recipeIngredients" :key="index">
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

   <main class="pt-4">
      <div class="container">
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
      </div>
   </main>
</template>

<style lang="scss" scoped>
.container {
   max-width: 375px;

   & > * {
      margin-bottom: 25px;
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
   &.overlay-loading {
      img {
         width: 200px;
         // border-radius: 40px;
         // box-shadow: 0 0 20px black;
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
            border: 2px solid #1212b2;
            cursor: pointer;
            padding: 0.3rem;
            position: absolute;
            top: 15px;
            right: 15px;
         }

         .recipe-image {
            background-image: url('../public/loader.gif');
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

@media screen and (min-width: 500px) {
   .overlay-modal {
      .my-modal {
         width: 450px !important;
      }
   }
}
</style>
