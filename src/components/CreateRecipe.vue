<script>
name: 'CreateRecipe';
import { config } from '../config';
import { store } from '../store';
export default {
   data() {
      return {
         config,
         store,
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

         store.recipe = JSON.parse(recipeResponse.choices[0].message.content);
         store.recipe.emoji = this.bowlSlots.join(' ');
         console.log(store.recipe.emoji);
         console.log(store.recipe.ingredienti);

         //3) chiamata per generare l'immagine
         const imageResponse = await this.makeRequest(this.IMAGE_ENDPOINT, {
            prompt: store.recipe.titolo,
            n: 1,
            size: '512x512',
            response_format: 'b64_json',
         });

         const imageUrl = imageResponse.data[0].b64_json;
         store.recipe.imageUrl = `data:image/png;base64, ${imageUrl}`;

         //4) nasconto il loader
         LOADING.classList.add('d-none');
         //5) mostro la modale
         MODAL.classList.remove('d-none');

         this.clearBowl();
      },
      clearBowl() {
         this.bowlSlots = [];
      },
   },
   mounted() {
      this.APY_KEY = config.KEY;

      const storage = localStorage.getItem(this.store.STORAGE_KEY);
      if (storage) {
         this.store.savedRecipes = JSON.parse(storage);
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

.overlay-loading {
   img {
      width: 200px;
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
