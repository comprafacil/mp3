import type { PageServerLoad } from './$types';
import { translations, type Locale } from '$lib/i18n';

const termsContent = {
  es: {
    title: 'Términos y Condiciones',
    content: `
      <h2>Aceptación de Términos</h2>
      <p>Al acceder y utilizar mp3.com, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguno de estos términos, por favor no utilices nuestro sitio.</p>
      
      <h2>Uso del Sitio</h2>
      <p>Este sitio es para uso personal y no comercial. No debes copiar, modificar o distribuir nuestro contenido sin autorización.</p>
      
      <h2>Contenido</h2>
      <p>El contenido de mp3 es para fines informativos únicamente. No garantizamos la precisión o integridad de la información.</p>
      
      <h2>Propiedad Intelectual</h2>
      <p>Todo el contenido, incluyendo textos, imágenes y código, es propiedad de mp3 y está protegido por derechos de autor.</p>
      
      <h2>Links de Afiliados</h2>
      <p>Nuestro sitio puede contener enlaces de afiliados. Podemos ganar una comisión por compras realizadas a través de estos enlaces.</p>
    `
  },
  en: {
    title: 'Terms and Conditions',
    content: `
      <h2>Acceptance of Terms</h2>
      <p>By accessing and using mp3.com, you agree to be bound by these terms and conditions. If you do not agree with any of these terms, please do not use our site.</p>
      
      <h2>Use of the Site</h2>
      <p>This site is for personal and non-commercial use. You must not copy, modify, or distribute our content without authorization.</p>
      
      <h2>Content</h2>
      <p>The content of mp3 is for informational purposes only. We do not guarantee the accuracy or completeness of the information.</p>
      
      <h2>Intellectual Property</h2>
      <p>All content, including text, images, and code, is the property of mp3 and is protected by copyright.</p>
      
      <h2>Affiliate Links</h2>
      <p>Our site may contain affiliate links. We may earn a commission on purchases made through these links.</p>
    `
  },
  pt: {
    title: 'Termos e Condições',
    content: `
      <h2>Aceitação dos Termos</h2>
      <p>Ao acessar e usar mp3.com, você concorda em estar vinculado a estes termos e condições. Se você não concordar com algum destes termos, por favor, não use nosso site.</p>
      
      <h2>Uso do Site</h2>
      <p>Este site é para uso pessoal e não comercial. Você não deve copiar, modificar ou distribuir nosso conteúdo sem autorização.</p>
      
      <h2>Conteúdo</h2>
      <p>O conteúdo do mp3 é apenas para fins informativos. Não garantimos a precisão ou completude das informações.</p>
      
      <h2>Propriedade Intelectual</h2>
      <p>Todo o conteúdo, incluindo texto, imagens e código, é propriedade do mp3 e está protegido por direitos autorais.</p>
      
      <h2>Links de Afiliados</h2>
      <p>Nosso site pode conter links de afiliados. Podemos ganhar uma comissão por compras feitas através desses links.</p>
    `
  }
};

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Locale;
  const t = translations[lang];
  
  return {
    lang,
    t,
    page: termsContent[lang]
  };
};
