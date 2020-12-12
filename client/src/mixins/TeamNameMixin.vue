<script>
export default {
  name: 'TeamNameMixin',
  methods: {
    translateTeamName(name) {
      switch (name) {
        case 'blue':
          return 'Niebiescy';
        case 'green':
          return 'Zieloni';
        case 'yellow':
          return 'Zółci';
        case 'red':
          return 'Czerwoni';
        case 'masters':
          return 'Mistrzowie';
        default:
          return 'Nieznani';
      }
    }
  },
  filters: {
    translateTeamName(name) {
      return this.translateTeamName(name);
    }
  }
};
</script>
