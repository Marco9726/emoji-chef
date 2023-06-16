<script>
name: 'Header';
export default {};
</script>

<template>
   <header>
      <h1>Emoji Chef</h1>
      <p>Selezione 3 emoji e crea la tua ricetta</p>
      <div id="logo">👨🏻‍🍳</div>
   </header>
</template>

<style lang="scss">
header {
   background-color: #2619aa;
   color: #eeb9f5;
   padding-top: 2rem;
   h1 {
      font-weight: 700;
   }

   #logo {
      font-size: 6rem;
      line-height: 1;
      position: relative;
      bottom: -3px;
   }
}
</style>
