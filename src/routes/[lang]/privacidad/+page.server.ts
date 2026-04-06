import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

const privacyContent = {
  es: {
    title: 'Política de Privacidad',
    content: `
      <h2>Introducción</h2>
      <p>En mp3-musica.com, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad explica cómo recopilamos, usamos y protegemos tu información.</p>
      
      <h2>Información que recopilamos</h2>
      <p>Recopilamos información que proporcionas directamente, como tu dirección de correo electrónico cuando te suscribes a nuestro newsletter.</p>
      
      <h2>Uso de la información</h2>
      <p>Utilizamos tu información para:</p>
      <ul>
        <li>Enviarte contenido exclusivo y actualizaciones</li>
        <li>Mejorar nuestros servicios y contenido</li>
        <li>Personalizar tu experiencia en nuestro sitio</li>
      </ul>
      
      <h2>Cookies</h2>
      <p>Utilizamos cookies para mejorar tu experiencia. Puedes desactivar las cookies en cualquier momento a través de la configuración de tu navegador.</p>
      
      <h2>Contacto</h2>
      <p>Si tienes preguntas sobre esta política, contactanos en admin@mp3-musica.com</p>
    `
  },
  en: {
    title: 'Privacy Policy',
    content: `
      <h2>Introduction</h2>
      <p>At mp3-musica.com, we value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.</p>
      
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly, such as your email address when you subscribe to our newsletter.</p>
      
      <h2>Use of Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Send you exclusive content and updates</li>
        <li>Improve our services and content</li>
        <li>Personalize your experience on our site</li>
      </ul>
      
      <h2>Cookies</h2>
      <p>We use cookies to improve your experience. You can disable cookies at any time through your browser settings.</p>
      
      <h2>Contact</h2>
      <p>If you have questions about this policy, contact us at admin@mp3-musica.com</p>
    `
  },
  pt: {
    title: 'Política de Privacidade',
    content: `
      <h2>Introdução</h2>
      <p>No mp3-musica.com, valorizamos sua privacidade e nos comprometemos a proteger seus dados pessoais. Esta política de privacidade explica como coletamos, usamos e protegemos suas informações.</p>
      
      <h2>Informações que coletamos</h2>
      <p>Coletamos informações que você fornece diretamente, como seu endereço de e-mail quando se inscreve em nossa newsletter.</p>
      
      <h2>Uso das Informações</h2>
      <p>Usamos suas informações para:</p>
      <ul>
        <li>Enviar conteúdo exclusivo e atualizações</li>
        <li>Melhorar nossos serviços e conteúdo</li>
        <li>Personalizar sua experiência em nosso site</li>
      </ul>
      
      <h2>Cookies</h2>
      <p>Utilizamos cookies para melhorar sua experiência. Você pode desativar os cookies a qualquer momento através das configurações do seu navegador.</p>
      
      <h2>Contato</h2>
      <p>Se você tiver dúvidas sobre esta política, entre em contato em admin@mp3-musica.com</p>
    `
  }
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const t = translations[lang];
  
  return {
    lang,
    t,
    page: privacyContent[lang],
    meta: {
      title: privacyContent[lang].title + ' | mp3-musica.com',
      description: 'Política de privacidad de mp3-musica.com - Cómo protectemos tus datos.'
    }
  };
};
