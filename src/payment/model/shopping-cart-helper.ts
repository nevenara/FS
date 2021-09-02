import { ShoppingCartTicket, ShoppingCartTicketSeller } from "./shopping-cart";


export class ShoppingCartHelper {

    public static getPriceInCents(price: number): number {
        return Math.trunc(price * 100);
    }

    public static getTicketSellers(tickets: ShoppingCartTicket[]): Array<ShoppingCartTicketSeller> {

        const sellers = Array<ShoppingCartTicketSeller>();
        const map = new Map();

        tickets.forEach(ticket => {
            const seller = sellers.find(n => n.sellerId === ticket.previousOwner);

            if (!seller) {
                sellers.push({
                    sellerId: ticket.previousOwner,
                    totalPrice: ticket.priceForSale,
                    stripeAccountId: ticket.stripeAccountId
                });
            } else {
                seller.totalPrice = seller.totalPrice + ticket.priceForSale;
            }
        });

        return sellers;
    }
}
