import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'gymos-jwt-secret-change-me';

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET: string = 'gymos-refresh-secret-change-me';

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES_IN: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsString()
  @IsOptional()
  PAYHERE_MERCHANT_ID?: string;

  @IsString()
  @IsOptional()
  PAYHERE_MERCHANT_SECRET?: string;

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:4200';
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.toString()}`);
  }

  return validatedConfig;
}
