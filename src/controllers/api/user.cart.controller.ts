import { Controller, Get, UseGuards, Req, Post, Body, Patch } from "@nestjs/common";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { CartService } from "src/services/cart/cart.service";
import { Cart } from "src/entities/cart.entity";
import { Request } from "express";
import { AddArticleToCartDto } from "src/dtos/cart/add.article.to.cart.dto";
import { EditArticleInCartDto } from "src/dtos/cart/edit.article.in.cart.dto";

@Controller('api/user/cart')
export class UserCartController{
    constructor(
        private cartService: CartService
    ) { }

    private async getActiveCartForUserId(userId: number): Promise<Cart> {
        let cart = await this.cartService.getLastActiveCartByUserid(userId);

        if (!cart) {
            cart = await this.cartService.createNewCartForUser(userId);
        }

        return await this.cartService.getById(cart.cartId);
    }

    @Get()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user') 
    async getCurrentCart(@Req() req: Request): Promise<Cart> {
        return await this.getActiveCartForUserId(req.token.id);
    }

    @Post('addToCart')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async addToCart(@Body() data: AddArticleToCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);

        return await this.cartService.addArticleToCart(cart.cartId, data.articleId, data.quantity);

    }

    // PATCH http://localhost:3000/api/user/cart/

    @Patch()
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('user')
    async changeQuantity(@Body() data: EditArticleInCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);
        return await this.cartService.changeQuantity(cart.cartId, data.articleId, data.quantity)

    }


}