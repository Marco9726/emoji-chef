import { reactive } from 'vue';

export const store = reactive({
	recipe: {},
	savedRecipes: [],
	STORAGE_KEY: 'saved_recipes',
});