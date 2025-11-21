import { shopifyServerFetch } from "@/lib/shopify/store-front/server";
import { convertGoogleMapsUrl } from "@/utils/shared/convertGoogleMapsUrl";

const GET_SHOP_NAME_QUERY = `
  query {
    shop {
      name
    }
  }
`;

export async function getShopName(): Promise<string> {
  try {
    const response = await shopifyServerFetch<{ shop: { name: string } }>(
      GET_SHOP_NAME_QUERY,
      undefined
    );
    if (!response?.shop?.name) {
      console.error("Failed to fetch shop name");
      return "Schumacher-Knepper";
    }
    return response?.shop?.name;
  } catch (error) {
    console.error("Failed to fetch shop name:", error);
    return "Schumacher-Knepper";
  }
}

const GET_SHOP_METAFIELD_QUERY = `
  query GetShopMetafield($key: String!) {
    shop {
      metafield(namespace: "custom", key: $key) {
        value
      }
    }
  }
`;

async function getShopMetafieldValue(key: string): Promise<string | null> {
  try {
    const response = await shopifyServerFetch<{
      shop: { metafield?: { value: string } | null };
    }>(GET_SHOP_METAFIELD_QUERY, { key });
    if (!response?.shop?.metafield?.value) {
      console.error(`Failed to fetch metafield ${key}`);
      return null;
    }
    return response?.shop?.metafield?.value;
  } catch (error) {
    console.error(`Failed to fetch metafield ${key}:`, error);
    return null;
  }
}

async function getShopMetafieldJson<T>(key: string): Promise<T | null> {
  const value = await getShopMetafieldValue(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse metafield ${key} JSON:`, error);
    return null;
  }
}

export async function getColorsConfig() {
  return getShopMetafieldJson<string[]>("colors");
}

const GET_IMAGE_URL_QUERY = `
  query GetImage($key: String!) {
    shop {
      metafield(namespace: "custom", key: $key) {
        reference {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
      }
    }
  }
`;

interface GetImageUrlResponse {
  shop: {
    metafield?: {
      reference?: {
        image?: {
          url: string;
        };
      };
    };
  };
}

export async function getImageUrl(key: string): Promise<string | null> {
  try {
    const response = await shopifyServerFetch<GetImageUrlResponse>(
      GET_IMAGE_URL_QUERY,
      { key }
    );

    if (!response?.shop?.metafield?.reference?.image?.url) {
      console.error(`Failed to fetch image URL for key: ${key}`);
      return null;
    }
    return response?.shop?.metafield?.reference?.image?.url;
  } catch (error) {
    console.error(`Failed to fetch image URL for key: ${key}`, error);
    return null;
  }
}

export async function getShopLocationUrl(): Promise<string> {
  const rawValue = await getShopMetafieldValue("shop_location_url");

  if (!rawValue) {
    console.error("Shop location URL metafield missing.");
    return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10364.189363249656!2d6.35322!3d49.5025!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795155944acdcb7%3A0xc23fde4d449060d4!2sDomaine%20viticole%20Schumacher-Knepper!5e0!3m2!1sfr!2sus!4v1763323542825!5m2!1sfr!2sus";
  }

  let parsed: { text?: string; url?: string } | null = null;

  try {
    parsed = JSON.parse(rawValue);
  } catch {
    try {
      return convertGoogleMapsUrl(rawValue);
    } catch {
      return rawValue;
    }
  }

  if (!parsed?.url) {
    console.error("Shop location metafield missing `.url` field.");
    return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10364.189363249656!2d6.35322!3d49.5025!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795155944acdcb7%3A0xc23fde4d449060d4!2sDomaine%20viticole%20Schumacher-Knepper!5e0!3m2!1sfr!2sus!4v1763323542825!5m2!1sfr!2sus";
  }

  try {
    return convertGoogleMapsUrl(parsed.url);
  } catch {
    return parsed.url;
  }
}

interface ShopLocation {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

const defaultLocation: ShopLocation = {
  name: "Domaine Viticole Schumacher-Knepper",
  street: "28, Wäistrooss",
  postalCode: "L-5495",
  city: "Wintrange",
  country: "Luxemburg",
};

export async function getShopLocation(): Promise<ShopLocation> {
  const parsed = await getShopMetafieldJson<ShopLocation>("shop_location");

  if (!parsed) {
    console.error("Shop location metafield missing or invalid.");
    return defaultLocation;
  }

  if (
    !parsed.name ||
    !parsed.street ||
    !parsed.postalCode ||
    !parsed.city ||
    !parsed.country
  ) {
    console.error("Shop location metafield missing required fields.");
    return defaultLocation;
  }

  return parsed;
}

export interface ShopPhone {
  phoneNumber: string;
  phoneDisplayed: string;
}

const defaultPhone: ShopPhone = {
  phoneNumber: "+352236045",
  phoneDisplayed: "+352 23 60 45",
};

export async function getShopPhone(): Promise<ShopPhone> {
  const parsed = await getShopMetafieldJson<ShopPhone>("shop_phone");

  if (!parsed) {
    console.error("Shop phone metafield missing or invalid.");
    return defaultPhone;
  }

  if (!parsed.phoneNumber || !parsed.phoneDisplayed) {
    console.error("Shop phone metafield missing required fields.");
    return defaultPhone;
  }

  return parsed;
}

export async function getShopEmail(): Promise<string> {
  const email = await getShopMetafieldValue("shop_email");

  if (!email) {
    console.error("Shop email metafield missing.");
    return "contact@schumacher-knepper.lu";
  }

  return email;
}

interface ShopFax {
  faxNumber: string;
  faxDisplayed: string;
}

const defaultFax: ShopFax = {
  faxNumber: "+35223664803",
  faxDisplayed: "+352 23 66 48 03",
};

export async function getShopFax(): Promise<ShopFax> {
  const parsed = await getShopMetafieldJson<ShopFax>("shop_fax");

  if (!parsed) {
    console.error("Shop fax metafield missing or invalid.");
    return defaultFax;
  }

  if (!parsed.faxNumber || !parsed.faxDisplayed) {
    console.error("Shop fax metafield missing required fields.");
    return defaultFax;
  }

  return parsed;
}

interface ShopPageContent {
  title?: string;
  articles?: {
    title?: string;
    paragraphs?: string[];
  }[];
}

const defaultDeliveryPolicies: ShopPageContent = {
  title: "Expéditions et retours",
  articles: [
    {
      title: "Expédition de votre colis",
      paragraphs: [
        "Les colis sont généralement expédiés dans un délai de 2 jours après réception du paiement. Ils sont expédiés via UPS avec un numéro de suivi et remis sans signature. Les colis peuvent également être expédiés via UPS Extra et remis contre signature. Veuillez nous contacter avant de choisir ce mode de livraison, car il induit des frais supplémentaires. Quel que soit le mode de livraison choisi, nous vous envoyons un lien pour suivre votre colis en ligne.",
        "Les frais d'expédition incluent les frais de préparation et d'emballage ainsi que les frais de port. Les frais de préparation sont fixes, tandis que les frais de transport varient selon le poids total du colis. Nous vous recommandons de regrouper tous vos articles dans une seule commande. Nous ne pouvons regrouper deux commandes placées séparément et des frais d'expédition s'appliquent à chacune d'entre elles. Votre colis est expédié à vos propres risques, mais une attention particulière est portée aux objets fragiles.",
        "Les dimensions des boîtes sont appropriées et vos articles sont correctement protégés.",
      ],
    },
  ],
};

export async function getShopDeliveryPolicies(): Promise<ShopPageContent> {
  const parsed =
    await getShopMetafieldJson<ShopPageContent>("delivery_policies");

  if (!parsed) {
    console.error("Delivery policies metafield missing or invalid.");
    return defaultDeliveryPolicies;
  }

  if (!parsed.title || !Array.isArray(parsed.articles)) {
    console.error("Invalid delivery policies format.");
    return defaultDeliveryPolicies;
  }

  return parsed;
}

const defaultGeneralPolicies: ShopPageContent = {
  title: "Conditions Générales de Vente",
  articles: [
    {
      title: "ARTICLE 1 - OBJET",
      paragraphs: [
        "Les présentes conditions générales de vente ont pour objet de définir les termes et conditions auxquels le Domaine Viticole Schumacher-Knepper, situé à 28, Wäistrooss à L-5495 Wintrange, propose et vend ses produits à ses clients via son site en ligne www.schumacher-knepper.lu.",
        "Ces conditions générales de vente pouvant faire l’objet de modifications, les conditions applicables sont celles en vigueur et consultables sur le site à la date de la passation de commande et elles prévaudront sur toutes autres conditions figurant dans tout autre document, sauf dérogation préalable, expresse et écrite.",
      ],
    },
    {
      title: "ARTICLE 2 - ACCEPTATIONS DES CONDITIONS",
      paragraphs: [
        "Le client déclare être âgé d’au moins 18 ans, d’avoir la capacité juridique ou être titulaire d’une autorisation parentale lui permettant d’effectuer une commande sur le site.",
        "Le client reconnaît avoir pris connaissance, au moment de la passation de commande, des présentes conditions générales de vente et déclare expressément les accepter sans réserve.",
        "Les présentes conditions générales de vente régissent les relations contractuelles entre le Domaine Viticole Schumacher-Knepper et son client, les deux parties les acceptant sans réserve.",
      ],
    },
    {
      title: "ARTICLE 3 - PRODUITS",
      paragraphs: [
        "Toute commande en ligne se fait sous réserve de la disponibilité en stock du produit commandé.",
        "La majorité des produits proposés par le Domaine Viticole Schumacher-Knepper à ses clients est immédiatement disponible.",
        "Cependant, certains des produits commercialisés par le Domaine Viticole Schumacher-Knepper peuvent ne pas être disponibles dans le cadre de la vente en ligne.",
        "Toute commande effectuée sur le site en ligne ne peut excéder en nombre de produits les besoins normaux d’un ménage privé.",
      ],
    },
    {
      title: "ARTICLE 4 - COMMANDE",
      paragraphs: [
        "Les données saisies par les systèmes d'enregistrement automatique sont considérées comme valant preuve de la nature, du contenu et de la date de la commande.",
        "Le Domaine Viticole Schumacher-Knepper confirmera au client l'acceptation de sa commande par l'envoi d'un message de confirmation à l'adresse mail que ce dernier aura communiquée.",
        "La vente ne sera conclue qu'à compter de l'envoi de ladite confirmation de commande.",
        "Le Domaine Viticole Schumacher-Knepper se réserve le droit de refuser ou d'annuler toute commande d'un client notamment en cas d'insolvabilité dudit client ou dans l'hypothèse d'un défaut de paiement de la commande concernée ou d'une commande antérieure ou d'un litige relatif au paiement d'une commande antérieure.",
        "Les mentions indiquées par le client, lors de la saisie des informations inhérentes à sa commande engagent celui-ci.",
        "Le Domaine Viticole Schumacher-Knepper ne saurait être tenu responsable des erreurs commises par le client dans le libellé des coordonnées du destinataire de la commande et des retards de livraison ou de l'impossibilité de livrer les produits commandés que ces erreurs pourraient engendrer.",
      ],
    },
    {
      title: "ARTICLE 5 - LIVRAISON",
      paragraphs: [
        "Après confirmation de la commande et sous réserve du paiement intégral du prix des produits commandés, le Domaine Viticole Schumacher-Knepper s'engage à expédier à son client les produits commandés à l'adresse de livraison dans un délai indiqué au moment de la sélection du mode de transport de la commande, sauf exception ou cas de force majeure.",
        "Tous les produits stipulés dans les commandes passées au Domaine Viticole Schumacher-Knepper sont destinés à l'usage personnel des clients ou des destinataires dont le nom est mentionné à l'adresse de livraison.",
        "Les clients ou les destinataires des produits s'interdisent toute revente partielle ou totale des produits.",
        "Le cas échéant, le client s'engage à régler à la réception toutes les taxes, droits, impôts et autres charges présents et à venir dus au titre de la livraison desdits produits eux-mêmes.",
        "Toute commande passée sur le site en ligne et livrée en dehors du Grand-Duché de Luxembourg pourra être soumise à des taxes éventuelles et à des droits de douane.",
        "La livraison sera effectuée par un transporteur selon la convenance du Domaine Viticole Schumacher-Knepper.",
        "Les tarifs de livraison seront affichés lors de la préparation de la commande en ligne.",
        "En cas de retard de livraison excédant quatorze (14) jours, le client pourra dénoncer le contrat par lettre recommandée.",
        "A la réception des produits commandés, le client ou le destinataire devra vérifier le bon état du bien livré.",
        "En cas de défauts apparents, le client bénéficie du droit de retour.",
        "Pour des raisons de disponibilité, une commande pourra faire l'objet de plusieurs livraisons successives.",
        "Si le client souhaite plusieurs adresses de livraison, il devra passer autant de commandes distinctes.",
      ],
    },
    {
      title: "ARTICLE 6 - RETRACTATION",
      paragraphs: [
        "Le client dispose d'un délai de 14 jours à compter de la réception des produits commandés pour les retourner au Domaine Viticole Schumacher-Knepper contre échange ou remboursement.",
        "Les produits doivent être renvoyés neufs, intacts et accompagnés de tous les accessoires éventuels à l'adresse suivante : Domaine Viticole Schumacher-Knepper, 28, Wäistrooss, L-5495 Wintrange.",
        "En cas d'exercice du droit de rétractation, le Domaine Viticole Schumacher-Knepper s'engage à rembourser les sommes versées par le client, sans frais, à l'exception des frais de retour.",
        "Le remboursement est dû dans un délai maximum de 30 jours.",
      ],
    },
    {
      title: "ARTICLE 7 - PRIX",
      paragraphs: [
        "Les prix sont exprimés en euros et s’entendent TVA comprise : 14% sur les vins et 17% sur les crémants.",
        "Les prix indiqués sur les fiches produit ne comprennent pas les frais inhérents au transport.",
        "Le prix total indiqué dans la confirmation de commande est le prix définitif.",
        "Ce prix comprend les produits, les frais de manutention, d'emballage, de conservation et les frais de transport.",
      ],
    },
    {
      title: "ARTICLE 8 - PAIEMENT",
      paragraphs: [
        "Le prix facturé au client est le prix total indiqué sur la confirmation de commande.",
        "Le prix facturé est payable au comptant le jour de la commande par un des moyens proposés sur le site.",
        "La commande validée ne sera effective que lorsque le centre de paiement sécurisé aura donné son accord.",
        "Les biens livrés demeurent la propriété du Domaine Viticole Schumacher-Knepper jusqu’au paiement intégral du prix.",
      ],
    },
    {
      title: "ARTICLE 9 - LOI APPLICABLE",
      paragraphs: [
        "Les présentes conditions générales de vente sont régies par le droit luxembourgeois.",
      ],
    },
    {
      title: "ARTICLE 10 - GARANTIES ET RESPONSABILITE",
      paragraphs: [
        "Le Domaine Viticole Schumacher-Knepper ne peut être tenu pour responsable des dommages matériels, immatériels ou corporels résultant d'une mauvaise utilisation des produits.",
        "La responsabilité du Domaine Viticole Schumacher-Knepper est limitée au montant de la commande.",
        "En cas de difficultés, le client et le Domaine pourront rechercher une solution amiable avant toute action en justice.",
        "A défaut, le Tribunal d’arrondissement de Luxembourg est seul compétent.",
        "La responsabilité du Domaine ne peut être engagée en cas de non-respect de la législation du pays de réception.",
        "Le client peut contacter le service clients par téléphone (00352 23 60 45) ou par mail (contact@schumacher-knepper.lu).",
      ],
    },
    {
      title: "ARTICLE 11 - INFORMATIONS LEGALES",
      paragraphs: [
        "Le renseignement des informations nominatives collectées aux fins de la vente à distance est obligatoire, ces informations étant indispensables pour le traitement et l'acheminement des commandes, l'établissement des factures et des contrats de garantie. Le défaut de renseignement entraîne la non-validation de la commande.",
        "Le client dispose (article 34 de la loi du 6 janvier 1978) d'un droit d'accès, de modification, de rectification et de suppression des données qui le concernent, qu'il peut exercer auprès du Domaine Viticole Schumacher-Knepper. De plus, le Domaine Viticole Schumacher-Knepper s'engage à protéger les données personnelles du client et à ne pas communiquer, gratuitement ou avec contrepartie, les données personnelles de ses clients à un tiers.",
      ],
    },
  ],
};

export async function getShopGeneralPolicies(): Promise<ShopPageContent> {
  const parsed =
    await getShopMetafieldJson<ShopPageContent>("general_policies");

  if (!parsed) {
    console.error("General policies metafield missing or invalid.");
    return defaultGeneralPolicies;
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.articles) ||
    parsed.articles.some(
      (article) => !article.title || !Array.isArray(article.paragraphs)
    )
  ) {
    console.error("Invalid general policies format.");
    return defaultGeneralPolicies;
  }

  return parsed;
}

const defaultAboutUs = {
  title: "À propos de nous",
  articles: [
    {
      title: "À propos de nous",
      paragraphs: [
        "Situé dans la vallée sud de la Moselle luxembourgeoise, le Domaine Viticole Schumacher-Knepper élabore des Vins et Crémants typiques de très haute qualité. L'entreprise familiale puise du savoir-faire et de la tradition de dix générations. En effet, depuis 1714 la famille se voue à la vigne et au vin.",
      ],
    },
  ],
};

export async function getShopAboutUs(): Promise<ShopPageContent> {
  const parsed = await getShopMetafieldJson<ShopPageContent>("shop_about_us");

  if (!parsed) {
    console.error("About us metafield missing or invalid.");
    return defaultAboutUs;
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.articles) ||
    parsed.articles.some(
      (article) => !article.title || !Array.isArray(article.paragraphs)
    )
  ) {
    console.error("Invalid about us format.");
    return defaultAboutUs;
  }

  return parsed;
}