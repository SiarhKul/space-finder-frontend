import {AuthService} from "./AuthService.ts";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {DataStack} from '../../../space-finder/outputs.json'

export class DataService {

    private authService: AuthService;
    private s3Client: S3Client | undefined;
    private awsRegion = 'eu-central-1'

    constructor(authService: AuthService) {
        this.authService = authService
    }

    public async createSpace(name: string,
                             location: string,
                             photo?: File) {
        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo)
            console.log("=>(DataService.tsx:21) uploadUrl", uploadUrl);
        }

        return '123'
    }


    private async uploadPublicFile(file: File) {
        const credantions = await this.authService.getTemporaryCredentials()

        if (!this.s3Client) {
            this.s3Client = new S3Client({
                credentials: credantions as any,
                region: this.awsRegion
            })
        }

        const command = new PutObjectCommand({
            Bucket: DataStack.Space,
            Key: file.name,
            ACL: "public-read",
            Body: file
        })

        await this.s3Client.send(command)

        return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`
    }


    public isAuthorized() {
        return true;
    }
}
