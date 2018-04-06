<template>
  <div class="app-login">
    <el-card>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-position="top"
        label-width="120px"
        class="app-login__form">

        <el-form-item label="Name" prop="name">
          <el-input v-model="loginForm.name"/>
        </el-form-item>

        <el-form-item label="Password" prop="password" :error="loginError">
          <el-input type="password" v-model="loginForm.password" auto-complete="off"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="login">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { LOGIN } from '@/store/user';

export default {
  name: 'AppLogin',
  data() {
    return {
      loginForm: {
        name: '',
        password: ''
      },
      rules: {
        name: { required: true, min: 4, max: 20 },
        password: { required: true }
      },
      loginError: null
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginError = null;
          this.$store.dispatch(LOGIN, this.loginForm)
            .catch((error) => {
              if (error.response.status === 403) {
                this.loginError = 'Incorrect password';
              }
              throw error;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-login {
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;

  /deep/ .el-card {
    width: 400px;
    margin: auto;
  }

  /deep/ .el-form-item__label::before {
    content: none;
  }
}
</style>
