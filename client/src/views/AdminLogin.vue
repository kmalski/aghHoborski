<script>
import LoginMixin from '@/mixins/LoginMixin';
import AdminLoginForm from '@/components/login/AdminLoginForm';

export default {
  name: 'AdminLogin',
  mixins: [LoginMixin],
  components: {
    AppLoginForm: AdminLoginForm
  }
};
</script>
