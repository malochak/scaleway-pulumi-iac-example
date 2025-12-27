# Contributing to Scaleway Pulumi IaC Example

Thank you for your interest in contributing! This project is an example infrastructure-as-code setup using Pulumi and Scaleway.

## How to Contribute

### Reporting Issues

- Check existing issues before creating a new one
- Provide clear description of the problem
- Include Pulumi version, Node.js version, and OS
- Share relevant error messages and logs

### Suggesting Enhancements

- Open an issue describing the enhancement
- Explain the use case and benefits
- Consider backwards compatibility

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages (see below)
6. Push to your fork
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 24+
- Pulumi CLI
- Scaleway account (for testing)

### Local Development

```bash
git clone https://github.com/YOUR_USERNAME/scaleway-pulumi-iac-example.git
cd scaleway-pulumi-iac-example

cd infra-bootstrap
npm install

cd ../infra
npm install
```

### Testing Changes

Before submitting a PR:

1. Test in a dev environment
2. Run `pulumi preview` to verify changes
3. Ensure no secrets are committed
4. Update documentation if needed

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
Add serverless container example to infra

- Add containerized application deployment
- Configure auto-scaling settings
- Update documentation
```

Format:
- First line: Brief summary (50 chars or less)
- Blank line
- Detailed description (if needed)
- Reference issues: `Fixes #123` or `Relates to #456`

## Code Style

- Use TypeScript strict mode
- Follow existing code structure
- Keep resource names consistent
- Add exports for reusable values
- No hardcoded credentials or secrets

## Documentation

- Update README.md for major changes
- Update QUICKSTART.md for new workflows
- Add inline code documentation for complex logic
- Keep examples simple and clear

## Project Structure

Maintain the existing structure:

```
infra-bootstrap/    # Shared resources (registry, etc.)
infra/              # Per-environment resources
```

New resources should go in the appropriate directory.

## Adding New Resources

When adding Scaleway resources:

1. Use official Scaleway provider resources
2. Tag resources appropriately
3. Export important values
4. Document in QUICKSTART.md
5. Consider multi-environment impact

## Security

- Never commit credentials, API keys, or secrets
- Use environment variables for sensitive data
- Review `.gitignore` for sensitive files
- Report security issues privately

## Questions?

Open an issue for questions or join discussions in the Issues tab.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.