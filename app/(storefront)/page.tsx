import { CategorySelection } from "@/components/ui/storefront/CategorySelection";
import { FeaturedProduct } from "@/components/ui/storefront/FeaturedProduct";
import { Hero } from "@/components/ui/storefront/Hero";

export default function IndexPage(){
    return(
        <div>
            <Hero/>
            <CategorySelection />
            <FeaturedProduct />
        </div>
    )
}