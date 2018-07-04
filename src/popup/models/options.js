export default {
  namespace:"options",
  state:{

  },
  effects:{
    *test({payload},{put,select}){
      console.log(payload);
    }
  },
  reducers:{

  },
}