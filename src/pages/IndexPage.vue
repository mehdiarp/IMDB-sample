<template>
  <q-page>
    <div class="row  q-pa-md justify-center">
      <div class="col-12 col-sm-10 col-md-9 col-xl-8">
        <div class="row q-px-md items-center">
              <span class="q-py-xs">search by release date:</span>
              <div class="col-12 col-md-5">
                <div class="row items-center">
                  <div class="col-5">
                    <q-input filled v-model="from" mask="####-##-##" :rules="[ val => val.test('dddd-dd-dd') || 'Please enter the date with YYYY-MM-YY format']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date mask="YYYY-MM-DD" v-model="from">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                  </div>
                  <div class="col-5">
                    <q-input filled v-model="to" mask="####-##-##" :rules="[ val => val.test('dddd-dd-dd') || 'Please enter the date with YYYY-MM-YY format']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date mask="YYYY-MM-DD" v-model="to">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                  </div>
                  <div class="col-12 column items-center">vote average:
                    <q-range
                      name="price_range"
                      v-model="average"
                      label-always
                      :min="0"
                      :max="10"
                    />
                  </div>
                </div>
              </div>
              <q-space/>
              <q-btn @click="getMovies" rounded color="primary" label="search" />
        </div>
        <div class="row q-pa-md">
          <div v-for="item in khar" :key="item.id" class="col-12 col-sm-6 col-md-4 col-xl-3 q-pa-sm column" >
            <q-item clickable @click="goToDetailPage(item.id)" class="row fit bg-amber q-pa-none" >
              <div class="col-6 bg-cyan-8">
                <q-img
                  class="fit"
                  :src="imageBaseUrl+item.poster_path"
                  style="height: 150px"
                />
              </div>
              <div class="col-6 column justify-between q-py-xl">
                <div>
                   <div class="text-capitalize q-pl-md">{{ item.title }}</div>
                </div>
                <div class="q-pl-md">
                  <div >{{item.release_date }}</div>
                  <div>
                    <span v-for="(genreId, index) in item.genre_ids" :key="genreId">{{getGenreName(genreId)}}<span v-if="index !==item.genre_ids.length-1">, </span></span>
                  </div>
<!--                  <div class="text-capitalize q-pl-md">sample-imdb</div>-->
<!--                  <div class="text-bold q-pl-md">no information</div>-->
<!--                  <div class="text-capitalize q-pl-md">date:2023/26/02</div>-->
                </div>
              </div>
            </q-item>
          </div>
        </div>
        <div class="row">
          <div class="col-12 bg-green" style="height: 200px">
            <div class="q-pa-lg flex flex-center">
              <q-pagination
                v-model="current"
                :max="5"
                input
                input-class="text-orange-10"
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
import { defineComponent, ref } from 'vue'
import {movieService} from "src/services/movie.service";
import {useRouter} from 'vue-router'
export default defineComponent({
  name: 'IndexPage',
  setup () {
    const Router = useRouter();
    const current = ref(1)
    const from = ref("")
    const to = ref("")
    const average= ref({
      min: 0, max: 10
    })
    let khar = ref([]);
    const imageBaseUrl = process.env.IMAGE_BASE_URL;
    const allGenres = ref([]);

    movieService.getAllGenres().then((result)=>{
      allGenres.value = result.data.genres;
      console.log('allGenres.value')
      console.log(allGenres.value)
    }).catch((error)=>{
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
      Router.push({ path: '/detail', query: { movieId: id }  })
    }
    // router.push({ name: 'user', params: { username: 'eduardo' } })
    function getMovies() {
      const mahdi = {
        ['primary_release_date.gte']: from.value,
        ['primary_release_date.lte']: to.value,
        ['vote_average.gte']: average.value.min,
        ['vote_average.lte']: average.value.max,
      }
      movieService.getAllMovies(mahdi).then((result)=>{
        khar.value = result.data.results;
        console.log(khar.value)
      }).catch((error)=>{
        console.log('ridi')
        console.log(error)
      })
    }
    return {
      current,
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
