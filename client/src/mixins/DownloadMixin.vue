<script>
import xlsx from 'xlsx';

export default {
  name: 'DownloadMixin',
  methods: {
    downloadJSON(questionSet, filename) {
      filename = filename.endsWith('json') ? filename : `${filename}.json`;
      this.download(JSON.stringify(questionSet, null, 2), filename, 'text/plain');
    },
    downloadSheet(questionSet, filename, extension) {
      const aoa = questionSet.categories.flatMap((category) =>
        category.questions.map((question) => [category.name, question.content, ...question.hints])
      );
      aoa.unshift(['Kategoria', 'Pytanie', 'Podpowiedz poprawna', 'Podpowiedz', 'Podpowiedz', 'Podpowiedz']);

      const wb = xlsx.utils.book_new();
      wb.Props = { Title: 'Awantura o Nauke' };
      wb.SheetNames.push('Pytania');
      wb.Sheets['Pytania'] = xlsx.utils.aoa_to_sheet(aoa);
      const wbout = xlsx.write(wb, { bookType: extension, type: 'binary' });

      const buffer = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
      filename = filename.endsWith(extension) ? filename : `${filename}.${extension}`;
      this.download(buffer, filename, 'application/octet-stream');
    },
    download(content, filename, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();
    }
  }
};
</script>
