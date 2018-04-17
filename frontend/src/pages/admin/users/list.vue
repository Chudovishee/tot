<template>
  <el-card class="app-admin-user-list">
    <div slot="header">Users list</div>

    <div v-for="user in users"
      :key="user.name"
      class="app-admin-user-list__user">

      <div class="app-admin-user-list__user-view">
        <div class="app-admin-user-list__name">{{ user.name }}</div>
        <div class="app-admin-user-list__access">
          {{ accessToString(user.access) }}
        </div>
        <div class="app-admin-user-list__actions">
          <el-button v-if="editing[user.name]"
            icon="el-icon-arrow-down"
            size="small"
            @click="editUser(user.name, false)"/>

          <el-button v-else
            icon="el-icon-edit"
            size="small"
            @click="editUser(user.name, true)"/>

          <el-popover placement="top">
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="small"/>

            <div class="app-admin-user-list__delete-confirm">
              <div class="app-admin-user-list__delete-confirm-text">Are you sure to delete?</div>
              <div class="app-admin-user-list__delete-confirm-button">
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteUser(user.name)">Yes</el-button>
              </div>
            </div>
          </el-popover>
        </div>
      </div>

      <app-admin-edit-user v-if="editing[user.name]"
        class="app-admin-user-list__user-edit"
        :value="user"/>
    </div>
  </el-card>
</template>

<script>
import {
  FETCH_USERS,
  DELETE_USER,
  SECURE_ALL,
  SECURE_USER,
  SECURE_CONFIGURE,
  SECURE_ADMIN
} from '@/store/users';
import AppAdminEditUser from './edit';

const accessStrings = {
  [SECURE_ALL]: 'Base read access',
  [SECURE_USER]: 'Read access',
  [SECURE_CONFIGURE]: 'Configure access',
  [SECURE_ADMIN]: 'Admin access'
};

export default {
  name: 'AppAdminUsersList',
  components: {
    AppAdminEditUser
  },
  data() {
    return {
      editing: {}
    };
  },
  mounted() {
    this.$store.dispatch(FETCH_USERS);
  },
  computed: {
    users() {
      return this.$store.state.users.list;
    }
  },
  methods: {
    accessToString(access) {
      return accessStrings[access] || access.toString();
    },
    deleteUser(name) {
      this.$store.dispatch(DELETE_USER, name);
    },
    editUser(name, open) {
      this.editing = {
        ...this.editing,
        [name]: !!open
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.app-admin-user-list {
  /deep/ .el-card__body {
    padding: 0;
  }

  &__delete-confirm {
    display: flex;
  }
  &__delete-confirm-text {
    line-height: 28px;
    margin-right: 8px;
  }

  &__user {
    padding: 8px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  &__user-view {
    display: flex;
  }

  &__user-edit {
    margin: 20px 0 12px 0;
  }

  &__name,
  &__access {
    line-height: 32px;
    height: 32px;
    margin-right: 8px;
  }

  &__name {
    flex: 1 0 auto;
    font-weight: bold;
  }
}
</style>
