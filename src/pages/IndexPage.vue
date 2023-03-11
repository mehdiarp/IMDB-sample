<template>
  <q-page>
    <q-page-scroller :offset="[18, 18]" :scroll-offset="150" position="bottom-left">
      <q-btn color="primary" fab icon="keyboard_arrow_up"/>
    </q-page-scroller>
    <div class="row  q-pa-md justify-center">
      <div class="col-12 col-sm-10 col-md-9 col-xl-8">
        <div class="row q-px-md items-center">

          <div class="col-12 col-md-5">
            <div class="row items-center q-pa-md">
              <div class="q-py-xs text-bold col-12">search by release date:</div>
              <div class="col-5">
                <q-input v-model="from" :rules="[ val => val.test('dddd-dd-dd') || 'Please enter the date with YYYY-MM-YY format']" filled
                         mask="####-##-##">
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="from" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat label="Close"/>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

              </div>
              <div class="col-5">
                <q-input v-model="to" :rules="[ val => val.test('dddd-dd-dd') || 'Please enter the date with YYYY-MM-YY format']" filled
                         mask="####-##-##">
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="to" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat label="Close"/>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

              </div>
              <div class="col-12 column items-center">vote average:
                <q-range
                  v-model="average"
                  :max="10"
                  :min="0"
                  label-always
                  name="price_range"
                />
              </div>
            </div>
          </div>
          <q-space/>
          <q-btn color="primary" label="search" rounded @click="getMovies"/>
        </div>
        <div class="row q-pa-md">
          <div v-for="item in khar" :key="item.id" class="col-12 col-sm-6 col-md-4 col-xl-3 q-pa-sm column">
            <q-item class="row fit bg-amber q-pa-none" clickable @click="goToDetailPage(item.id)">
              <div class="col-6 bg-cyan-8">
                <q-img
                  :src="imageBaseUrl+item.poster_path"
                  class="fit"
                  style="height: 150px"
                />
              </div>
              <div class="col-6 column justify-between q-py-xl">
                <div>
                  <div class="text-capitalize q-pl-md">{{ item.title }}</div>
                </div>
                <div class="q-pl-md">
                  <div>
                    <q-icon name="event"/>
                    {{ item.release_date }}
                  </div>
                  <div>
                    <span v-for="(genreId, index) in item.genre_ids" :key="genreId">{{ getGenreName(genreId) }}<span
                      v-if="index !==item.genre_ids.length-1">, </span></span>
                  </div>
                  <!--                  <div class="text-capitalize q-pl-md">sample-imdb</div>-->
                  <!--                  <div class="text-bold q-pl-md">no information</div>-->
                  <!--                  <div class="text-capitalize q-pl-md">date:2023/26/02</div>-->
                </div>
              </div>
            </q-item>
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-12 q-px-sm">
            <div class="q-pa-lg bg-amber flex flex-center">
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                input
                input-class="text-orange-10"
                @update:model-value="getMovies"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    <img-->
    <!--      alt="Quasar logo"-->
    <!--      src="~assets/quasar-logo-vertical.svg"-->
    <!--      style="width: 200px; height: 200px"-->
    <!--    >-->
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue'
import {movieService} from "src/services/movie.service";
import {useRouter, useRoute} from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    // variable
    const Router = useRouter();
    const Route = useRoute();
    const currentPage = ref(Route.query['page'] || 1)
    const totalPages = ref(0)
    const from = ref(Route.query['primary_release_date.gte'])
    const to = ref(Route.query['primary_release_date.lte'])
    const average = ref({
      min: Route.query['vote_average.gte'] || 0, max: Route.query['vote_average.lte'] || 10
    })
    let khar = ref([]);
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    const allGenres = ref([]);

    //methods
    movieService.getAllGenres().then((result) => {
      allGenres.value = result.data.genres;
      console.log('allGenres.value')
      console.log(allGenres.value)
    }).catch((error) => {
      console.log('ridi')
      console.log(error)
    })

    getMovies();


    function getGenreName(id) {
      // console.log(('id'))
      // console.log((id))
      const result = allGenres.value.find(genre => genre.id === id);
      // console.log(('result'))
      // console.log((result))
      return result.name;
    }

    function goToDetailPage(id) {
      Router.push({path: '/detail', query: {movieId: id}})
    }

    function isNumeric(str) {
      if (typeof str != "string") return false // we only process strings!
      return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    // router.push({ name: 'user', params: { username: 'eduardo' } })
    function getMovies(page) {
      console.log('khaaaaaaar')
      console.log(page)
      const query = {
        ['primary_release_date.gte']: from.value,
        ['primary_release_date.lte']: to.value,
        ['vote_average.gte']: average.value.min,
        ['vote_average.lte']: average.value.max,
        ['page']: isNumeric(page) ? page : currentPage.value,
      }
      Router.replace({query})
      movieService.getAllMovies(query).then((result) => {
        khar.value = result.data.results;
        totalPages.value = result.data.total_pages;
        console.log(khar.value)
      }).catch((error) => {
        console.log('ridi')
        console.log(error)
      })
    }

    return {
      currentPage,
      totalPages,
      from,
      to,
      average,
      khar,
      imageBaseUrl,
      allGenres,
      getGenreName,
      goToDetailPage,
      getMovies,
      // essentialLinks: linksList,
      // leftDrawerOpen,
      // toggleLeftDrawer () {
      //   leftDrawerOpen.value = !leftDrawerOpen.value
      // }
    }
  }
})
</script>
