export const pricingCards = [
  {
    title: "Starter",
    description: "Perfect for trying out plura",
    price: "Free",
    duration: "",
    highlight: "Key features",
    features: ["3 Sub accounts", "2 Team members", "Unlimited pipelines"],
    priceId: "",
  },
  {
    title: "Unlimited Saas",
    description: "The ultimate agency kit",
    price: "$199",
    duration: "month",
    highlight: "Key features",
    features: ["Rebilling", "24/7 Support team"],
    priceId: "price_1OYxkqFj9oKEERu1KfJGWxgN",
  },
  {
    title: "Basic",
    description: "For serious agency owners",
    price: "$49",
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: ["Unlimited Sub accounts", "Unlimited Team members"],
    priceId: "price_1OYxkqFj9oKEERu1NbKUxXxN",
  },
];

export const addOnProducts = [
  { title: "Priority Support", id: "prod_PNjJAE2EpP16pn" },
];

export type EditorBtns =
   | 'text'
  | 'button'
  | 'list'
  | 'form'
  | 'audio'
  | 'image'
  | 'video'
  | 'link'
  | 'container'
  | '2Col'
  | '3Col'
  | '2ColChart'
  | '3ColChart'
  | 'contactForm'
  | 'paymentForm'
  | 'ol'        
  | 'ul' 
   |'TwoColcomponent' 
  |'ThreeColComponent' 

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
};
export type EditorElement = {
  id: string
  name: string
  styles: React.CSSProperties
  type: EditorBtns
  
  content: 
    | { 
        innerText?: string; 
        placeholder?: string; 
        href?: string;
        src?: string;
        iconName?: string;
        file?: File; 
        name?: string;
        content?: string;
        buttonText?: string;
        email?: string;
        message?: string;
        items?: any[];   
        left?: string;
        right?: string;
        alt?: string;   
        type?: string;  
        index?: number;
     
         

      } 
     
    
    | EditorElement[]

}
