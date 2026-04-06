import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

const cookiesContent = {
  es: {
    title: 'Política de Cookies',
    content: `<h2>Qué son las Cookies</h2><p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web.</p><h2>Cómo Utilizamos las Cookies</h2><p>Utilizamos cookies para recordar tu idioma preferido, analizar el tráfico de nuestro sitio y mejorar tu experiencia de usuario.</p><h2>Cómo Gestionar las Cookies</h2><p>Puedes configurar tu navegador para rechazar todas las cookies.</p>`
  },
  en: {
    title: 'Cookie Policy',
    content: `<h2>What Are Cookies</h2><p>Cookies are small text files stored on your device when you visit our website.</p><h2>How We Use Cookies</h2><p>We use cookies to remember your preferred language, analyze site traffic, and improve your user experience.</p><h2>How to Manage Cookies</h2><p>You can configure your browser to reject all cookies.</p>`
  },
  pt: {
    title: 'Política de Cookies',
    content: `<h2>O que são Cookies</h2><p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site.</p><h2>Como Utilizamos Cookies</h2><p>Utilizamos cookies para lembrar seu idioma preferido, analisar o tráfego do nosso site e melhorar sua experiência do usuário.</p><h2>Como Gerenciar Cookies</h2><p>Você pode configurar seu navegador para rejeitar todos os cookies.</p>`
  }
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  return {
    lang,
    t: translations[lang],
    page: cookiesContent[lang],
    meta: {
      title: cookiesContent[lang].title + ' | mp3-musica.com',
      description: 'Política de cookies de mp3-musica.com'
    }
  };
};
