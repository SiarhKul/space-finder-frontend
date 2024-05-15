import {AuthService} from "./AuthService.ts";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {DataStack, ApiStack} from '../../../space-finder/outputs.json'

const spacesUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + 'space'

export class DataService {

    private authService: AuthService;
    private s3Client: S3Client | undefined;
    private awsRegion = 'eu-central-1'

    constructor(authService: AuthService) {
        this.authService = authService
    }

    public isAuthorized() {
        return true;
    }

    public async createSpace(name: string,
                             location: string,
                             photo?: File): Promise<string> {
        const space: Record<string, unknown> = {}
        space.name = name
        space.location = location

        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo)
            space.photo = uploadUrl
        }

        const postResult = await fetch(spacesUrl, {
            method: "POST",
            body: JSON.stringify(space),
            headers: {
                'Authorization': this.authService.jwtToken ?? ''
            }
        })

        const postResultJSON = await postResult.json()

        return postResultJSON.id
    }

    //-------------------------PRIVET
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


}
