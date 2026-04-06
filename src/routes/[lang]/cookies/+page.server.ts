import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

const cookiesContent = {
  es: {
    title: 'Política de Cookies',
    content: `
      <h2>Qué son las Cookies</h2>
      <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web.</p>
      
      <h2>Cómo Utilizamos las Cookies</h2>
      <p>Utilizamos cookies para:</p>
      <ul>
        <li>Recordar tu idioma preferido</li>
        <li>Analizar el tráfico de nuestro sitio</li>
        <li>Mejorar tu experiencia de usuario</li>
      </ul>
      
      <h2>Tipos de Cookies que Utilizamos</h2>
      <ul>
        <li><strong>Esenciales:</strong> Necesarias para el funcionamiento del sitio</li>
        <li><strong>Analíticas:</strong> Nos ayudan a entender cómo interactúas con nuestro sitio</li>
        <li><strong>Funcionales:</strong> Permiten recordar tus preferencias</li>
      </ul>
      
      <h2>Cómo Gestionar las Cookies</h2>
      <p>Puedes configurar tu navegador para rechazar todas las cookies o para alerts cuando se envíen cookies.</p>
    `
  },
  en: {
    title: 'Cookie Policy',
    content: `
      <h2>What Are Cookies</h2>
      <p>Cookies are small text files stored on your device when you visit our website.</p>
      
      <h2>How We Use Cookies</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Remember your preferred language</li>
        <li>Analyze traffic on our site</li>
        <li>Improve your user experience</li>
      </ul>
      
      <h2>Types of Cookies We Use</h2>
      <ul>
        <li><strong>Essential:</strong> Required for the site to function</li>
        <li><strong>Analytics:</strong> Help us understand how you interact with our site</li>
        <li><strong>Functional:</strong> Allow us to remember your preferences</li>
      </ul>
      
      <h2>How to Manage Cookies</h2>
      <p>You can set your browser to reject all cookies or to alert you when cookies are sent.</p>
    `
  },
  pt: {
    title: 'Política de Cookies',
    content: `
      <h2>O que são Cookies</h2>
      <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site.</p>
      
      <h2>Como Utilizamos Cookies</h2>
      <p>Utilizamos cookies para:</p>
      <ul>
        <li>Lembrar seu idioma preferido</li>
        <li>Analisar o tráfego do nosso site</li>
        <li>Melhorar sua experiência do usuário</li>
      </ul>
      
      <h2>Tipos de Cookies que Utilizamos</h2>
      <ul>
        <li><strong>Essenciais:</strong> Necessários para o funcionamento do site</li>
        <li><strong>Analíticos:</strong> Nos ajudam a entender como você interage com nosso site</li>
        <li><strong>Funcionais:</strong> Permitem lembrar suas preferências</li>
      </ul>
      
      <h2>Como Gerenciar Cookies</h2>
      <p>Você pode configurar seu navegador para rejeitar todos os cookies ou para alertá-lo quando cookies forem enviados.</p>
    `
  }
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const t = translations[lang];
  
  return {
    lang,
    t,
    page: cookiesContent[lang]
  };
};
