<script>
name: 'Header';
export default {
   methods: {
      changeActiveTab() {
         let activeTab = document.body.dataset.activeTab;
         if (activeTab == 'create') {
            document.body.dataset.activeTab = 'saved';
         } else {
            document.body.dataset.activeTab = 'create';
         }
      },
   },
};
</script>

<template>
   <header>
      <h1>Emoji Chef</h1>
      <p>Selezione 3 emoji e crea la tua ricetta</p>
      <div id="logo">👨🏻‍🍳</div>
      <div id="tabs">
         <button id="createRecipe" data-tab="create" @click="changeActiveTab()">
            <i class="fa-solid fa-plus"></i>
         </button>
         <button id="savedRecipes" data-tab="saved" @click="changeActiveTab()">
            <i class="fa-regular fa-bookmark"></i>
         </button>
      </div>
   </header>
</template>

<style lang="scss">
header {
   background-color: #2619aa;
   color: #eeb9f5;
   padding-top: 2rem;
   position: relative;
   h1 {
      font-weight: 700;
   }

   #logo {
      font-size: 6rem;
      line-height: 1;
      position: relative;
      bottom: -3px;
   }

   #tabs {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;

      button {
         background-color: transparent;
         border: none;
         color: #b2d1fb80;
         border-radius: 0.5rem;
         font-size: 1.5rem;
         margin-left: 1rem;

         &.active {
            color: white;
         }
      }
   }
}

[data-active-tab='create'] {
   #tabs {
      button[data-tab='create'] {
         color: white;
      }
   }
}

[data-active-tab='saved'] {
   #tabs {
      button[data-tab='saved'] {
         color: white;
      }
   }
}
</style>
