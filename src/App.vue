<script>
import Header from './components/Header.vue';
import CreateRecipe from './components/CreateRecipe.vue';
import SavedRecipes from './components/SavedRecipes.vue';
import RecipeModal from './components/RecipeModal.vue';
export default {
   components: {
      Header,
      CreateRecipe,
      SavedRecipes,
      RecipeModal,
   },
};
</script>

<template>
   <Header></Header>

   <main class="pt-4">
      <!-- modal  -->
      <RecipeModal></RecipeModal>
      <!-- CreateRecipe -->
      <CreateRecipe></CreateRecipe>
      <!-- SavedRecipes -->
      <SavedRecipes></SavedRecipes>
   </main>
</template>

<style lang="scss" scoped>
[data-active-tab='create'] {
   section:not(.createRecipe) {
      display: none;
   }
}

[data-active-tab='saved'] {
   section:not(.savedRecipes) {
      display: none;
   }
}
</style>
