import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

const termsContent = {
  es: {
    title: 'Términos y Condiciones',
    content: `
      <h2>Aceptación de Términos</h2>
      <p>Al acceder y utilizar mp3-musica.com, aceptas estar sujeto a estos términos y condiciones.</p>
      
      <h2>Uso del Sitio</h2>
      <p>Este sitio es para uso personal y no comercial. No debes copiar, modificar o distribuir nuestro contenido sin autorización.</p>
      
      <h2>Contenido</h2>
      <p>El contenido de mp3-musica.com es para fines informativos únicamente.</p>
      
      <h2>Propiedad Intelectual</h2>
      <p>Todo el contenido es propiedad de mp3-musica.com y está protegido por derechos de autor.</p>
      
      <h2>Links de Afiliados</h2>
      <p>Nuestro sitio puede contener enlaces de afiliados.</p>
    `
  },
  en: {
    title: 'Terms and Conditions',
    content: `
      <h2>Acceptance of Terms</h2>
      <p>By accessing and using mp3-musica.com, you agree to be bound by these terms and conditions.</p>
      
      <h2>Use of the Site</h2>
      <p>This site is for personal and non-commercial use. You must not copy, modify, or distribute our content without authorization.</p>
      
      <h2>Content</h2>
      <p>The content of mp3-musica.com is for informational purposes only.</p>
      
      <h2>Intellectual Property</h2>
      <p>All content is property of mp3-musica.com and is protected by copyright.</p>
      
      <h2>Affiliate Links</h2>
      <p>Our site may contain affiliate links.</p>
    `
  },
  pt: {
    title: 'Termos e Condições',
    content: `
      <h2>Aceitação dos Termos</h2>
      <p>Ao acessar e usar mp3-musica.com, você concorda em estar vinculado a estes termos e condições.</p>
      
      <h2>Uso do Site</h2>
      <p>Este site é para uso pessoal e não comercial. Você não deve copiar, modificar ou distribuir nosso conteúdo sem autorização.</p>
      
      <h2>Conteúdo</h2>
      <p>O conteúdo do mp3-musica.com é apenas para fins informativos.</p>
      
      <h2>Propriedade Intelectual</h2>
      <p>Todo o conteúdo é propriedade do mp3-musica.com e está protegido por direitos autorais.</p>
      
      <h2>Links de Afiliados</h2>
      <p>Nosso site pode conter links de afiliados.</p>
    `
  }
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const t = translations[lang];
  
  return {
    lang,
    t,
    page: termsContent[lang],
    meta: {
      title: termsContent[lang].title + ' | mp3-musica.com',
      description: 'Términos y condiciones de mp3-musica.com'
    }
  };
};
