<script>
import xlsx from 'xlsx';

export default {
  name: 'UploadMixin',
  methods: {
    readJSON(reader, file, callback) {
      reader.onload = (event) => {
        const parsedFile = JSON.parse(event.target.result);
        callback(parsedFile);
      };
      reader.readAsText(file);
    },
    readSheet(reader, file, callback) {
      reader.onload = (event) => {
        let binary = '';
        const bytes = new Uint8Array(event.target.result);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        const wb = xlsx.read(binary, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const sheet = xlsx.utils.sheet_to_json(ws, { header: 1 });

        const categories = [];
        for (let i = 1; i < sheet.length; ++i) {
          const row = sheet[i];
          const categoryName = row[0].trim();
          const category = categories.find((category) => category.name === categoryName);
          const question = { content: row[1].trim(), hints: row.slice(2).map((hint) => String(hint).trim()) };
          if (category) {
            category.questions.push(question);
          } else {
            categories.push({ name: categoryName, questions: [question] });
          }
        }
        callback({ categories });
      };
      reader.readAsArrayBuffer(file);
    }
  }
};
</script>
