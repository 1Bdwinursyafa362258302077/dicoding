// src/scripts/pages/about/about-page.js
class AboutPage {
  async render() {
    return `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Lewati ke konten</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Tentang Dicoding Story</h1>
        
        <div class="about-content">
          <p>
            Dicoding Story adalah platform untuk berbagi cerita, pengalaman, dan momen
            terkait perjalananmu bersama Dicoding. Baik saat merayakan pencapaian belajar,
            membagikan tantangan coding yang berhasil diselesaikan, atau mendokumentasikan
            perjalananmu sebagai developer — inilah tempat yang tepat untuk itu!
          </p>
          
          <div class="features">
            <h2>Fitur</h2>
            <ul>
              <li>
                <i class="fas fa-camera"></i>
                <span>Ambil dan bagikan foto langsung melalui aplikasi</span>
              </li>
              <li>
                <i class="fas fa-map-marker-alt"></i>
                <span>Tambahkan data lokasi ke cerita yang kamu bagikan</span>
              </li>
              <li>
                <i class="fas fa-globe"></i>
                <span>Jelajahi cerita melalui peta interaktif</span>
              </li>
              <li>
                <i class="fas fa-bell"></i>
                <span>Terima notifikasi untuk cerita terbaru</span>
              </li>
            </ul>
          </div>
          
          <div class="tech-stack">
            <h2>Teknologi yang Digunakan</h2>
            <p>Aplikasi ini dibangun menggunakan:</p>
            <ul>
              <li>JavaScript murni dengan pola Model-View-Presenter (MVP)</li>
              <li>Arsitektur Single Page Application dengan routing berbasis hash</li>
              <li>Mapbox untuk peta interaktif</li>
              <li>Webpack untuk proses bundling</li>
              <li>Web Push untuk notifikasi</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Tidak ada yang perlu dilakukan untuk halaman about
  }
}

export default AboutPage;
