import { ConfigService } from "../common/config-service";
import { IEmailSender } from "../common/email-service/email-sender";
import { ValidationError } from "../common/errors/validation-error";
import { SortUtil } from "../common/sort";
import { IUserContext } from "../common/user-context";
import { FAQDbObject } from "../faq/faq-db-object";
import { IFAQRepository } from "../faq/faq-repository";
import { FAQUserDbObject } from "../faq/faq-user-db-object";
import { IFAQUserRepository } from "../faq/faq-user-repository";
import { FAQCategory } from "../faq/models/faq-category";
import { LocalisationKey } from "../localisation/localisation-key";
import { DislikeFAQRequest } from "./models/dislike-faq-request";
import { LikeFAQResponse } from "./models/dislike-faq-response";
import { FAQResponse, FAQsByCategoryResponse, GetFAQsResponse } from "./models/get-faqs-response";
import { GetSupportContactResponse } from "./models/get-support-contact-response";
import { LikeFAQRequest } from "./models/like-faq-request";
import { DislikeFAQResponse } from "./models/like-faq-response";
import { SendEmailToSupportRequest } from "./models/send-email-to-support-request";
import { SendEmailToSupportResponse } from "./models/send-email-to-support-response";
const moment = require('moment-timezone');

export interface ISupportPageController {
    getFAQs(): Promise<GetFAQsResponse>;
    getSupportContact(): Promise<GetSupportContactResponse>;
    likeFAQ(request: LikeFAQRequest): Promise<LikeFAQResponse>;
    dislikeFAQ(request: DislikeFAQRequest): Promise<DislikeFAQResponse>;
    sendEmailToSupport(request: SendEmailToSupportRequest): Promise<SendEmailToSupportResponse>;
}

export class SupportPageController implements ISupportPageController {

    constructor(
        private context: IUserContext,
        private faqRepository: IFAQRepository,
        private faqUserRepository: IFAQUserRepository,
        private emailSender: IEmailSender,
        private configService: ConfigService
    ){}

    public async getFAQs(): Promise<GetFAQsResponse> {
        this.context.validateIfAuthenticated();
        const response = new GetFAQsResponse();
        const TIME_ZONE = await this.configService.getConfig('timeZone', 'Europe/Vienna');
        response.FAQsByCategory = [];


        
        /* for (let i = 0; i < 6; i++) {
            const faq = new FAQDbObject();
            faq.question = 'Question' + i;
            faq.answer = 'Answer' + i;
            faq.dislikes = i;
            faq.likes = i * 10;
            faq.lastUpdate = new Date();
            faq.category = i%2==0 ? FAQCategory.General : FAQCategory.SellingAndBuying;
            
            await this.faqRepository.create(faq);
        } */
       

        const faqs = await this.faqRepository.getFAQsByCategory();
        if(faqs) {
            for (let i = 0; i < faqs.length; i++) {
                const faq = faqs[i];
    
                const faqsByCategoryResponse: FAQsByCategoryResponse = new FAQsByCategoryResponse();
                faqsByCategoryResponse.category = faq._id.category
                faqsByCategoryResponse.FAQs = [];
                for (let j = 0; j < faq.FAQsByCategory.length; j++) {
                    const element = faq.FAQsByCategory[j];
    
                    let faqResponse: FAQResponse = new FAQResponse();
                    faqResponse = element as FAQResponse;
                    faqResponse.lastUpdate = moment.tz(faqResponse.lastUpdate, TIME_ZONE).format();

                    const action = await this.faqUserRepository.getUserActionByFAQIdAndUserId(this.context.userId, faqResponse.id);
                    faqResponse.isLiked = action && action.like ? true : false;
                    faqResponse.isDisliked = action && !action.like ? true : false;
    
                    faqsByCategoryResponse.FAQs.push(faqResponse);
                    
                }

                
    
                faqsByCategoryResponse.FAQs.sort(SortUtil.sortByCustomProperty('id', 1));
                faqsByCategoryResponse.category == FAQCategory.General ? response.FAQsByCategory.unshift(faqsByCategoryResponse) : response.FAQsByCategory.push(faqsByCategoryResponse);
                
            }
         
        }
          return response;
    }

    public async getSupportContact(): Promise<GetSupportContactResponse> {
        this.context.validateIfAuthenticated();
        const SUPPORT_EMAIL = await this.configService.getConfig('supportEmail');
        const SUPPORT_PHONE = await this.configService.getConfig('supportPhone');
        
        const response: GetSupportContactResponse = new GetSupportContactResponse();
        response.email = SUPPORT_EMAIL;
        response.phone = SUPPORT_PHONE;

        return response;
    }

    public async likeFAQ(request: LikeFAQRequest): Promise<LikeFAQResponse> {
        this.context.validateIfAuthenticated();
        const exists = await this.faqUserRepository.getUserActionByFAQIdAndUserId(this.context.userId, request.id);
        const faq = await this.faqRepository.getFAQById(request.id);

        if(exists && exists.like){
            faq.likes -=1;
            await this.faqUserRepository.deleteObjectById(exists._id);
        }
        else if(exists && !exists.like){
            faq.likes +=1;
            faq.dislikes -=1;

            exists.like = true;
            await this.faqUserRepository.updateObjectById(exists._id, new FAQUserDbObject(exists));
        }
        else{
            faq.likes += 1;

                
            //insert action
            const action: FAQUserDbObject = new FAQUserDbObject();
            action.faqId = request.id;
            action.userId = this.context.userId;
            action.like = true;
            await this.faqUserRepository.create(action);
        }

        const TIME_ZONE = await this.configService.getConfig('timeZone', 'Europe/Vienna');

        await this.faqRepository.updateObjectById(request.id, new FAQDbObject(faq));

        const response: LikeFAQResponse = new LikeFAQResponse();
        response.faq = new FAQResponse();
        response.faq.id = faq._id;
        response.faq.question = faq.question;
        response.faq.answer = faq.answer;
        response.faq.likes = faq.likes;
        response.faq.dislikes = faq.dislikes;
        response.faq.lastUpdate = moment.tz(faq.lastUpdate, TIME_ZONE).format();

        const action = await this.faqUserRepository.getUserActionByFAQIdAndUserId(this.context.userId, request.id);

        response.faq.isLiked = action && action.like ? true : false;
        response.faq.isDisliked = action && !action.like ? true : false;
        
        return response;

    }

    public async dislikeFAQ(request: DislikeFAQRequest): Promise<DislikeFAQResponse> {
        this.context.validateIfAuthenticated();

        const exists = await this.faqUserRepository.getUserActionByFAQIdAndUserId(this.context.userId, request.id);
        
        const faq = await this.faqRepository.getFAQById(request.id);

        if(exists && !exists.like){
            faq.dislikes -= 1;
            await this.faqUserRepository.deleteObjectById(exists._id);
        }
        else if(exists && exists.like){
            faq.likes -=1;
            faq.dislikes +=1;

            exists.like = false;
            await this.faqUserRepository.updateObjectById(exists._id, new FAQUserDbObject(exists));
        }
        else{
            faq.dislikes += 1;

            //insert action
            const action: FAQUserDbObject = new FAQUserDbObject();
            action.faqId = request.id;
            action.userId = this.context.userId;
            action.like = false;
            await this.faqUserRepository.create(action);

        }

        const TIME_ZONE = await this.configService.getConfig('timeZone', 'Europe/Vienna');

        await this.faqRepository.updateObjectById(request.id, new FAQDbObject(faq));
        
        const response: DislikeFAQResponse = new DislikeFAQResponse();
        response.faq = new FAQResponse();
        response.faq.id = faq._id;
        response.faq.question = faq.question;
        response.faq.answer = faq.answer;
        response.faq.likes = faq.likes;
        response.faq.dislikes = faq.dislikes;
        response.faq.lastUpdate = moment.tz(faq.lastUpdate, TIME_ZONE).format();
       
        const action = await this.faqUserRepository.getUserActionByFAQIdAndUserId(this.context.userId, request.id);

        response.faq.isLiked = action && action.like ? true : false;
        response.faq.isDisliked = action && !action.like ? true : false;

        return response;

    }

    public async sendEmailToSupport(request: SendEmailToSupportRequest): Promise<SendEmailToSupportResponse> {
        this.context.validateIfAuthenticated();

        await this.emailSender.sendEmailToSupport(request);
        const response: SendEmailToSupportResponse = new SendEmailToSupportResponse();
        return response;
    }

}