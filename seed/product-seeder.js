//a little module I used to test the database and the generation/rendering of items in it

var Product = require("../models/product");

var mongoose = require("mongoose");

mongoose.connect("localhost:27017/eshop");

var products = [
    new Product({
    imagePath: "/images/produkty/2-1_Base_and_Top_Coat.jpg",
    title: "2in1 Base and Top Coat",
    description: "This transparent base and top coat dries quickly and protects your nails. applied as a base coat it forms the ideal basis for applying the color. It protects the nail from discoloration by color pigments and facilitates the application of color polish. used as a top coat, it seals the color paint and thus prevents premature chipping and fading caused by sunlight. Increased gloss force for a radiant nail makeup.",
    price: 6.80
}),
    new Product({
        imagePath: "/images/produkty/nail-polish-remover-acetone-free-100ml-artdeco-6194_image.jpg",
        title: "Nail Polish Remover",
        description: "With the non-acetone nail polish remover ARTDECO you can thoroughly and gently clean your nails of color. This nail polish remover without acetone is suitable for natural and artificial nails.",
        price: 5.95
    }),
    new Product({
        imagePath: "/images/produkty/scandalous-lashes-mascara-artdeco-2097-1_image.jpg",
        title: "Scandalous Lashes Mascara",
        description: "Dizzying momentum that keeps felt forever, fantastic volume and endless length: The Scandalous Lashes mascara is perfect for women who simply want everything for your lashes. The flexible rubber brush and texture are so well matched that the mascara to your lashes after mascara once an overwhelming WOW! - Effect gives. A so scandalous Augenaufschlag conjure otherwise only false eyelashes. The product features include: WOW-lashes with False Lashes Effect after the first mascara. Good covering, x-treme black special texture. Amplifies the volume, gives length and fixes the swing Creamy formulation with special combined waxes. Compacted lashes and keeps them supple yet.    Flexible rubber brush with crescent blades. Tuscht even the smallest lashes from root to tip. Separates lashes perfectly. Skin compatibility dermatologically approved.",
        price: 14.99
    }),
    new Product({
        imagePath: "/images/produkty/boosting-gel-moisturizer-artdeco-65103_image.jpg",
        title: "Boosting Gel Moisturizer",
        description: "Boosting Moisturizer Gel gives you an invigorating moisture boost! The gel is absorbed quickly and gives the skin long-lasting moisture. Goji berry extract gives important substances and nourishes the skin silky-soft. The fresh scent of ginger & Goji berry is invigorating. Suitable for all skin types.",
        price: 12.99
    }),
    new Product({
        imagePath: "/images/produkty/deep-exfoliating-foot-scrub-artdeco-65230_image.jpg",
        title: "Deep Exfoliating Foot Scrub",
        description: "The Deep Exfoliating Foot Scrub removes dead skin cells gently with natural volcanic sand and fine bamboo powder. After nursing your feet feel supple and completely renewed. The unique scent of Asian neroli and sandalwood donates relaxed wellbeing. Suitable for all skin types.",
        price: 9.99
    }),
    new Product({
        imagePath: "/images/produkty/crystal-mascara-liner-artdeco-56381-1_image.jpg",
        title:"Crystal Mascara & Liner",
        description: "The Crystal Mascara & Liner gives your eye makeup a fantastic and yet discreet glitter. The ingenious applicator makes the liner so special: With the integrated tufts drag a sparkling eyeliner. And the embossed fine grooves are perfect to decorate your eyelashes with glitter. Product features at a glance: Glittering Mascara & Liquid Liner Transparent gel texture with fine glitter particles. Special applicator: Fine brush for eyeliner. Grooves to deceive the eyelashes. Fragrance-free.Not suitable for the interior of the eye.",
        price: 12.99
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    console.log("Im saving");
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    } );
}

function exit() {
    mongoose.disconnect();
}
